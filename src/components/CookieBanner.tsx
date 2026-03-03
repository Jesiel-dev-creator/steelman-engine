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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/95 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted)]">
          This site uses cookies.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--border)]/50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-[var(--blue)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
