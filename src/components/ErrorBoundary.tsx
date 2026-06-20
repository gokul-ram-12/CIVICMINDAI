import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] w-full flex items-center justify-center p-6 no-print">
          <div className="w-full max-w-lg luxury-glass p-8 border border-white/10 bg-white/[0.02] shadow-2xl space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="editorial-heading text-xl text-white">Interface Interrupted</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                A rendering exception occurred in this board view. This could be due to incomplete configuration state parameters.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-black rounded-xl border border-white/5 text-left font-mono text-[9px] text-zinc-500 break-words leading-relaxed max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
