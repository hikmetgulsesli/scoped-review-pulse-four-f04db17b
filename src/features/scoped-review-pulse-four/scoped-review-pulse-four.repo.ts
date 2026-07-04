// Persistence adapter for the Scoped Review Pulse Four feature.
//
// Writes the status items to localStorage under a versioned key. Corrupted
// JSON is detected, isolated (the bad payload is moved to a sibling key so
// it can be inspected), and surfaced as a recoverable error to the store.

import type { StatusItem } from './scoped-review-pulse-four.types';

export const STORAGE_KEY = 'scoped-review-pulse-four:items:v1';
export const STORAGE_QUARANTINE_KEY = 'scoped-review-pulse-four:corrupted:v1';

export interface RepoLoadResult {
  ok: boolean;
  items: StatusItem[];
  error?: string;
}

export interface RepoSaveResult {
  ok: boolean;
  error?: string;
}

/** Returns true if a window localStorage is available. */
export function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/** Validate the shape of a parsed payload before trusting it. */
function isStatusItem(value: unknown): value is StatusItem {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.label === 'string' &&
    typeof record.active === 'boolean' &&
    (typeof record.updatedAt === 'number' || typeof record.updatedAt === 'undefined')
  );
}

function parseItems(raw: string): StatusItem[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Persisted payload is not an array.');
  }
  const items: StatusItem[] = [];
  for (const entry of parsed) {
    if (!isStatusItem(entry)) {
      throw new Error('Persisted payload contains an invalid item.');
    }
    items.push({
      id: entry.id,
      label: entry.label,
      active: entry.active,
      updatedAt: typeof entry.updatedAt === 'number' ? entry.updatedAt : Date.now(),
    });
  }
  return items;
}

export function loadItems(): RepoLoadResult {
  if (!hasLocalStorage()) {
    return { ok: false, items: [], error: 'Local storage is not available in this environment.' };
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return {
      ok: false,
      items: [],
      error: `Failed to read persisted items: ${(error as Error).message}`,
    };
  }
  if (raw === null) {
    return { ok: true, items: [] };
  }
  try {
    const items = parseItems(raw);
    return { ok: true, items };
  } catch (error) {
    // Quarantine the bad payload so we never lose it but stop treating it as truth.
    try {
      window.localStorage.setItem(STORAGE_QUARANTINE_KEY, raw);
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Best-effort cleanup; failure to quarantine is non-fatal.
    }
    return {
      ok: false,
      items: [],
      error: `Persisted items are corrupted and were quarantined: ${(error as Error).message}`,
    };
  }
}

export function saveItems(items: StatusItem[]): RepoSaveResult {
  if (!hasLocalStorage()) {
    return { ok: false, error: 'Local storage is not available in this environment.' };
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: `Failed to persist items: ${(error as Error).message}`,
    };
  }
}

export function clearItems(): RepoSaveResult {
  if (!hasLocalStorage()) return { ok: false, error: 'Local storage is not available.' };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: `Failed to clear items: ${(error as Error).message}` };
  }
}