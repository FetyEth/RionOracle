"use client";

type AnalyticsEvent =
  | "verify_click"
  | "verify_success"
  | "report_download"
  | "proof_share"
  | "receipt_verify"
  | "dispute_view_tx"
  | "sdk_install_click"
  | "playground_run"
  | "widget_embed_copy";

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  // Privacy-safe analytics - only track actions, no PII
  console.log(" Analytics event:", event, properties);

  // In production, this would send to your analytics service
  // Example: window.plausible?.(event, { props: properties })
}

export function useAnalytics() {
  return { trackEvent };
}
