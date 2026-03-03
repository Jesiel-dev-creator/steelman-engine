"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === null) setShow(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-[860px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          This site uses cookies.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleDecline}
            className="min-h-[44px] min-w-[80px] flex-1 rounded-lg border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] transition-colors hover:bg-[var(--border)]/50 sm:flex-none sm:py-2"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="min-h-[44px] min-w-[80px] flex-1 rounded-lg bg-[var(--blue)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] sm:flex-none sm:py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
