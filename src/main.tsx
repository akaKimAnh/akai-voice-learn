import React, { StrictMode, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };


  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }


  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in AKAI Voice AI:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#1E293B' }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', maxWidth: '500px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0D9488', marginBottom: '0.5rem' }}>AKAI Voice AI</h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Ứng dụng vừa gặp sự cố khi khởi chạy. Lỗi chi tiết:
            </p>
            <pre style={{ background: '#F1F5F9', padding: '0.75rem', borderRadius: '0.5rem', textWrap: 'wrap', textAlign: 'left', fontSize: '0.75rem', color: '#EF4444', marginBottom: '1.5rem', overflowX: 'auto' }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#0D9488', color: '#FFFFFF', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Tải lại trang (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);




