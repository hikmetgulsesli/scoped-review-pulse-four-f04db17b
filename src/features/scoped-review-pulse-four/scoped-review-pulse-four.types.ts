// Type definitions for the Scoped Review Pulse Four feature.
//
// These shapes describe the shared app shell state that US-001 owns.
// They are imported by the store, repo, fixture, test bridge, and App.tsx.

export type StorageStatus = 'idle' | 'ready' | 'corrupted';

export type ActivePanel = 'overview' | 'detail';

export type SurfaceId = 'SURF_STATUS_UTILITY';

export type ScreenRoute = 'status-utility';

export interface StatusItem {
  id: string;
  label: string;
  active: boolean;
  updatedAt: number;
}

export interface ScopedReviewPulseFourState {
  /** The surface id currently shown in the app shell. */
  activeSurface: SurfaceId;
  /** The logical route / screen name for tests and analytics. */
  activeScreen: ScreenRoute;
  /** The id of the currently selected item, or null when nothing is selected. */
  selectedItemId: string | null;
  /** The status items rendered by the owned screen. */
  items: StatusItem[];
  /** Lifecycle of the persistence adapter. */
  storageStatus: StorageStatus;
  /** Last surfaced error string, cleared on next successful operation. */
  lastError: string | null;
  /** The currently visible side panel in the shell. */
  activePanel: ActivePanel;
  /** Convenience count derived from `items`. */
  itemCount: number;
}

export type ScopedReviewPulseFourAction =
  | { type: 'TOGGLE_ITEM'; itemId: string }
  | { type: 'REFRESH' }
  | { type: 'SELECT_ITEM'; itemId: string | null }
  | { type: 'SET_PANEL'; panel: ActivePanel }
  | { type: 'HYDRATE'; items: StatusItem[] }
  | { type: 'STORAGE_READY' }
  | { type: 'STORAGE_CORRUPTED'; error: string }
  | { type: 'CLEAR_ERROR' };

export interface ScopedReviewPulseFourBridge {
  activeScreen: ScreenRoute;
  selectedRecord: StatusItem | null;
  counts: {
    total: number;
    active: number;
  };
  storageStatus: StorageStatus;
  lastError: string | null;
  activePanel: ActivePanel;
}

export interface ScopedReviewPulseFourStoreApi {
  state: ScopedReviewPulseFourState;
  dispatch: React.Dispatch<ScopedReviewPulseFourAction>;
  /** Stable action handlers keyed by screen action ids. */
  actions: {
    'toggle-status-1': () => void;
    'refresh-2': () => void;
  };
}

declare global {
  interface Window {
    app?: ScopedReviewPulseFourBridge & {
      // Internal-only handle for tests to reach the store.
      __store?: ScopedReviewPulseFourStoreApi;
    };
  }
}