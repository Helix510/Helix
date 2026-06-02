import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#08090d', color: '#e6e9f4', minHeight: '100-screen' }}>
          <h1 style={{ color: '#ff4d4d' }}>Something went wrong.</h1>
          <pre style={{ backgroundColor: '#1d2030', padding: '10px', borderRadius: '8px' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#00cfb4', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
