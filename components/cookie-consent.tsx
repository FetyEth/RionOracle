"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[400px] pointer-events-auto">
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl p-5">
        <p className="text-sm text-white/90 leading-relaxed mb-4">
          We use cookies to improve your experience and for analytics.{" "}
          <a
            href="/privacy"
            className="underline hover:text-[#D0FF00] transition-colors"
          >
            Learn more in our cookie policy
          </a>
          .
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] rounded-lg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 text-sm font-medium bg-[#D0FF00] text-black rounded-lg hover:bg-[#D0FF00]/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
