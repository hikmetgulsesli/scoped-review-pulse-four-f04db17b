// Scoped Review Pulse Four store — Context, reducer, provider, and hooks.
//
// Owns the shared app shell state (active surface, selected item, storage
// status, last error, active panel, item count) and exposes stable action
// handlers keyed by screen action ids for screen-owner stories.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { createDefaultStatusItems } from '../../__fixtures__/scoped-review-pulse-four.fixture';
import { loadItems, saveItems } from './scoped-review-pulse-four.repo';
import type {
  ActivePanel,
  ScopedReviewPulseFourAction,
  ScopedReviewPulseFourBridge,
  ScopedReviewPulseFourState,
  StatusItem,
} from './scoped-review-pulse-four.types';
import type { ScopedReviewPulseFourStoreApi } from './scoped-review-pulse-four.types';

export type { ScopedReviewPulseFourStoreApi };

export const INITIAL_STATE: ScopedReviewPulseFourState = {
  activeSurface: 'SURF_STATUS_UTILITY',
  activeScreen: 'status-utility',
  selectedItemId: null,
  items: [],
  storageStatus: 'idle',
  lastError: null,
  activePanel: 'overview',
  itemCount: 0,
};

function computeItemCount(items: StatusItem[]): number {
  return items.length;
}

function reducer(
  state: ScopedReviewPulseFourState,
  action: ScopedReviewPulseFourAction,
): ScopedReviewPulseFourState {
  switch (action.type) {
    case 'HYDRATE': {
      return {
        ...state,
        items: action.items,
        itemCount: computeItemCount(action.items),
      };
    }
    case 'TOGGLE_ITEM': {
      let changed = false;
      const nextItems = state.items.map((item) => {
        if (item.id !== action.itemId) return item;
        changed = true;
        return { ...item, active: !item.active, updatedAt: Date.now() };
      });
      if (!changed) return state;
      return { ...state, items: nextItems, lastError: null };
    }
    case 'REFRESH': {
      // Refresh is the contract action: re-seeds items from defaults and
      // returns the shell to a known-good state.
      const items = createDefaultStatusItems();
      return {
        ...state,
        items,
        itemCount: computeItemCount(items),
        selectedItemId: null,
        storageStatus: 'ready',
        lastError: null,
      };
    }
    case 'SELECT_ITEM': {
      return { ...state, selectedItemId: action.itemId };
    }
    case 'SET_PANEL': {
      return { ...state, activePanel: action.panel };
    }
    case 'STORAGE_READY': {
      return { ...state, storageStatus: 'ready', lastError: null };
    }
    case 'STORAGE_CORRUPTED': {
      return { ...state, storageStatus: 'corrupted', lastError: action.error };
    }
    case 'CLEAR_ERROR': {
      return state.lastError === null ? state : { ...state, lastError: null };
    }
    default: {
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}

export function deriveBridge(state: ScopedReviewPulseFourState): ScopedReviewPulseFourBridge {
  const selectedRecord =
    state.selectedItemId === null
      ? null
      : state.items.find((item) => item.id === state.selectedItemId) ?? null;
  return {
    activeScreen: state.activeScreen,
    selectedRecord,
    counts: {
      total: state.itemCount,
      active: state.items.filter((item) => item.active).length,
    },
    storageStatus: state.storageStatus,
    lastError: state.lastError,
    activePanel: state.activePanel,
  };
}

const StoreContext = createContext<ScopedReviewPulseFourStoreApi | null>(null);

export interface ScopedReviewPulseFourStoreProviderProps {
  children: ReactNode;
  /** Initial items override (used by tests). */
  initialItems?: StatusItem[];
  /** When true, skip the localStorage hydration step. */
  skipHydration?: boolean;
}

export function ScopedReviewPulseFourStoreProvider({
  children,
  initialItems,
  skipHydration = false,
}: ScopedReviewPulseFourStoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    items: initialItems ?? [],
    itemCount: (initialItems ?? []).length,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Tracks the items reference we last persisted (or just hydrated) so the
  // persist effect can skip writes when state.items hasn't actually changed.
  // Also breaks the save-failure retry loop: when a save fails we transition
  // to 'corrupted' and bail out instead of re-firing the effect.
  const lastSavedItemsRef = useRef<StatusItem[] | null>(null);

  // Hydrate from persistence on mount, then seed defaults if empty.
  useEffect(() => {
    if (skipHydration) {
      // Still mark storage ready so the UI does not stay in 'idle' forever.
      if (stateRef.current.storageStatus === 'idle') {
        dispatch({ type: 'STORAGE_READY' });
      }
      lastSavedItemsRef.current = stateRef.current.items;
      return;
    }
    const result = loadItems();
    if (!result.ok) {
      dispatch({ type: 'STORAGE_CORRUPTED', error: result.error ?? 'Unknown persistence error.' });
      // Seed defaults so the app is still usable.
      const seeded = createDefaultStatusItems();
      dispatch({ type: 'HYDRATE', items: seeded });
      lastSavedItemsRef.current = seeded;
      return;
    }
    if (result.items.length === 0) {
      const seeded = createDefaultStatusItems();
      dispatch({ type: 'HYDRATE', items: seeded });
      const saved = saveItems(seeded);
      if (saved.ok) {
        dispatch({ type: 'STORAGE_READY' });
        lastSavedItemsRef.current = seeded;
      } else {
        dispatch({ type: 'STORAGE_CORRUPTED', error: saved.error ?? 'Failed to persist seed items.' });
      }
      return;
    }
    dispatch({ type: 'HYDRATE', items: result.items });
    dispatch({ type: 'STORAGE_READY' });
    lastSavedItemsRef.current = result.items;
  }, [skipHydration]);

  // Persist items whenever they change after hydration.
  useEffect(() => {
    if (state.storageStatus !== 'ready') return;
    if (state.items.length === 0) return;
    // Referential equality: skip the redundant write right after hydration.
    if (state.items === lastSavedItemsRef.current) return;

    const saved = saveItems(state.items);
    if (saved.ok) {
      lastSavedItemsRef.current = state.items;
    } else {
      dispatch({ type: 'STORAGE_CORRUPTED', error: saved.error ?? 'Failed to persist items.' });
    }
  }, [state.items, state.storageStatus]);

  // Stable action handlers keyed by screen action ids.
  const toggleFirst = useCallback(() => {
    const current = stateRef.current;
    const target = current.items[0];
    if (!target) return;
    dispatch({ type: 'TOGGLE_ITEM', itemId: target.id });
  }, []);

  const refresh = useCallback(() => {
    dispatch({ type: 'REFRESH' });
  }, []);

  // Memoize actions separately so its reference stays stable across state
  // updates. Child components (e.g. StatusUtilityScopedReviewPulseFour) only
  // re-render when an action handler actually changes, not on every dispatch.
  const actions = useMemo(
    () => ({
      'toggle-status-1': toggleFirst,
      'refresh-2': refresh,
    }),
    [toggleFirst, refresh],
  );

  const api = useMemo<ScopedReviewPulseFourStoreApi>(
    () => ({
      state,
      dispatch,
      actions,
    }),
    [state, actions],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useScopedReviewPulseFourStore(): ScopedReviewPulseFourStoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useScopedReviewPulseFourStore must be used inside ScopedReviewPulseFourStoreProvider.');
  }
  return ctx;
}

export function useScopedReviewPulseFourState(): ScopedReviewPulseFourState {
  return useScopedReviewPulseFourStore().state;
}

export function useScopedReviewPulseFourBridge(): ScopedReviewPulseFourBridge {
  const { state } = useScopedReviewPulseFourStore();
  return deriveBridge(state);
}

export function useSetActivePanel(): (panel: ActivePanel) => void {
  const { dispatch } = useScopedReviewPulseFourStore();
  return useCallback((panel: ActivePanel) => dispatch({ type: 'SET_PANEL', panel }), [dispatch]);
}

export function useSelectItem(): (itemId: string | null) => void {
  const { dispatch } = useScopedReviewPulseFourStore();
  return useCallback(
    (itemId: string | null) => dispatch({ type: 'SELECT_ITEM', itemId }),
    [dispatch],
  );
}