import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid red',
          borderRadius: '8px',
          backgroundColor: '#ffe6e6',
          color: '#d00'
        }}>
          <h2>❌ React Error Detected!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary><strong>Error Message:</strong></summary>
            {this.state.error && this.state.error.toString()}
          </details>
          
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary><strong>Stack Trace:</strong></summary>
            {this.state.error && this.state.error.stack}
          </details>
          
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary><strong>Component Stack:</strong></summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#d00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary