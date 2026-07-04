import { useEffect } from 'react';
import { StatusUtilityScopedReviewPulseFour } from './screens';
import {
  ScopedReviewPulseFourStoreProvider,
  useScopedReviewPulseFourStore,
} from './features/scoped-review-pulse-four/scoped-review-pulse-four.store';
import { installTestBridge } from './test/bridge';

function AppShell() {
  const store = useScopedReviewPulseFourStore();

  // Install the window.app bridge once per store mount. Re-installs on state
  // changes so tests always observe a fresh snapshot.
  useEffect(() => {
    installTestBridge(store);
  }, [store]);

  return (
    <div
      data-setfarm-root="scoped-review-pulse-four"
      data-testid="setfarm-app-root"
      className="min-h-screen bg-slate-50 text-slate-950"
    >
      <StatusUtilityScopedReviewPulseFour actions={store.actions} />
    </div>
  );
}

export default function App() {
  return (
    <ScopedReviewPulseFourStoreProvider>
      <AppShell />
    </ScopedReviewPulseFourStoreProvider>
  );
}