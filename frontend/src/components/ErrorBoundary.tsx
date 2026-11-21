import { Component, type ReactNode } from 'react';
import { LogoMark } from './brand/Logo';

type State = { error: Error | null };

// Catches render errors (and failed lazy-route chunk loads after a deploy)
// so one broken page doesn't blank the whole app.
class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const chunkFailed = /dynamically imported module|Loading chunk|Failed to fetch/i.test(this.state.error.message);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <LogoMark className="h-12 w-12" />
        <h1 className="text-2xl font-bold text-slate-900">{chunkFailed ? 'A new version is available' : 'Something went wrong'}</h1>
        <p className="max-w-md text-slate-600">
          {chunkFailed ? 'Reload the page to get the latest version of Bazaarly.' : 'Sorry about that. Reloading the page usually fixes it.'}
        </p>
        <div className="flex gap-3">
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>Reload page</button>
          <a href="/" className="btn-secondary">Go home</a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
