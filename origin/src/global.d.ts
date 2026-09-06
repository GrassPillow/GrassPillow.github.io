// ─── Global Toast types ─────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastAPI {
  success(message: string, duration?: number): void
  error(message: string, duration?: number): void
  warning(message: string, duration?: number): void
  info(message: string, duration?: number): void
}

declare global {
  interface Window {
    $toast?: ToastAPI
  }
}

export {}
