// Simple analytics helper for Plausible
// Replace with your own analytics provider if needed

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview');
  }
}
