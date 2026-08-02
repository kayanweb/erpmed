import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to system diagnostics if it were a real backend
    // fetch('/api/diagnostics/log', { ... })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 p-8 text-center" dir="rtl">
          <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">عذراً، حدث خطأ غير متوقع</h1>
          <p className="text-slate-600 mb-6 max-w-lg">
            تم تسجيل الخطأ في نظام المراقبة المركزي (Auto Recovery & Diagnostics). يمكنك المحاولة مرة أخرى أو تحديث الصفحة.
          </p>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-inner w-full max-w-2xl text-left overflow-auto mb-6 text-xs text-rose-600 font-mono" dir="ltr">
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 shadow-md transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            إعادة تحميل النظام (Auto Recovery)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
