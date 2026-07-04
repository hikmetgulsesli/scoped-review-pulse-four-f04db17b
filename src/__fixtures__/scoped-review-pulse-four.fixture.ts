// Default fixture data for the Scoped Review Pulse Four store.
//
// Used as the seed list when localStorage is empty and as a deterministic
// reset target for tests.

import type { StatusItem } from '../features/scoped-review-pulse-four/scoped-review-pulse-four.types';

export const DEFAULT_STATUS_ITEMS: readonly StatusItem[] = [
  {
    id: 'status-pulse-core',
    label: 'Pulse Core',
    active: true,
    updatedAt: 0,
  },
  {
    id: 'status-review-queue',
    label: 'Review Queue',
    active: false,
    updatedAt: 0,
  },
  {
    id: 'status-scope-watch',
    label: 'Scope Watch',
    active: true,
    updatedAt: 0,
  },
] as const;

/** Returns a fresh mutable copy of the default items for store seeding. */
export function createDefaultStatusItems(): StatusItem[] {
  return DEFAULT_STATUS_ITEMS.map((item) => ({ ...item, updatedAt: Date.now() }));
}