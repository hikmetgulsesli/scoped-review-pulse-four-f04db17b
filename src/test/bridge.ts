// Test bridge: installs the `window.app` handle that the test contract
// requires. Reads from the current store API and exposes a flat snapshot
// suitable for assertions. Also performs a clean uninstall for test teardown.

import {
  deriveBridge,
  type ScopedReviewPulseFourStoreApi,
} from '../features/scoped-review-pulse-four/scoped-review-pulse-four.store';
import type { ScopedReviewPulseFourBridge } from '../features/scoped-review-pulse-four/scoped-review-pulse-four.types';

export function installTestBridge(api: ScopedReviewPulseFourStoreApi): ScopedReviewPulseFourBridge {
  if (typeof window === 'undefined') {
    throw new Error('installTestBridge requires a browser-like environment.');
  }
  const bridge = deriveBridge(api.state);
  const handle = {
    ...bridge,
    __store: api,
  };
  window.app = handle;
  return bridge;
}

export function uninstallTestBridge(): void {
  if (typeof window === 'undefined') return;
  if (window.app) {
    delete window.app;
  }
}

/** Read the current bridge snapshot from the store api, without mutating window. */
export function readBridge(api: ScopedReviewPulseFourStoreApi): ScopedReviewPulseFourBridge {
  return deriveBridge(api.state);
}