"use client";

import { useState } from "react";

type SteelmanResult = {
  steelman: string;
  counterSteelman: string;
  kernel: string;
};

export default function Home() {
  const [argument, setArgument] = useState("");
  const [result, setResult] = useState<SteelmanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (!result) return;
    const text = [
      "Original argument:",
      argument.trim(),
      "",
      "The Steelman:",
      result.steelman,
      "",
      "The Counter-Steelman:",
      result.counterSteelman,
      "",
      "The Kernel:",
      result.kernel,
      "",
      "— The Steelman Engine",
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSteelman() {
    if (!argument.trim()) {
      setError("Please enter an argument to steelman.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/steelman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument: argument.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to steelman");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 min-h-screen">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6">
        {/* HERO */}
        <div className="py-12 pb-10 text-center sm:py-[100px] sm:pb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] px-3 py-1.5 sm:mb-8 sm:px-4">
            <span className="eyebrow-pulse h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#60a5fa]">
              Powered by Claude AI
            </span>
          </div>

          <h1 className="font-bebas mb-4 text-[clamp(48px,14vw,110px)] leading-[0.9] tracking-[0.02em] sm:mb-6 sm:text-[clamp(64px,10vw,110px)]">
            <span
              className="bg-gradient-to-b from-white to-[#94a3b8] bg-clip-text text-transparent"
              style={{
                filter: "drop-shadow(0 0 60px rgba(37,99,235,0.3))",
              }}
            >
              The Steelman
              <br />
              Engine
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-[500px] px-2 text-base font-light leading-relaxed text-[var(--muted)] sm:mb-12 sm:text-lg">
            Most people argue against the weakest version of ideas they disagree
            with. We fix that.
          </p>

          {/* CONCEPT BADGES */}
          <div className="mb-10 flex flex-wrap justify-center gap-4 sm:mb-16 sm:gap-8">
            <ConceptBadge
              dotColor="#d97706"
              label="Steelman"
              tooltip="The strongest possible case FOR the argument"
            />
            <ConceptBadge
              dotColor="#e11d48"
              label="Counter-Steelman"
              tooltip="The strongest possible case AGAINST it"
            />
            <ConceptBadge
              dotColor="#059669"
              label="The Kernel"
              tooltip="The truth both sides are actually circling"
            />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--border)] sm:mb-12 sm:rounded-2xl sm:grid-cols-3">
          <div className="bg-[var(--surface)] p-4 text-center sm:p-6">
            <div className="font-bebas mb-2 text-4xl leading-none text-[rgba(37,99,235,0.3)]">
              01
            </div>
            <div className="text-[13px] leading-relaxed text-[#94a3b8]">
              Paste any argument, opinion, or hot take
            </div>
          </div>
          <div className="bg-[var(--surface)] p-4 text-center sm:p-6">
            <div className="font-bebas mb-2 text-4xl leading-none text-[rgba(37,99,235,0.3)]">
              02
            </div>
            <div className="text-[13px] leading-relaxed text-[#94a3b8]">
              Hit Steelman It and let the engine work
            </div>
          </div>
          <div className="bg-[var(--surface)] p-4 text-center sm:p-6">
            <div className="font-bebas mb-2 text-4xl leading-none text-[rgba(37,99,235,0.3)]">
              03
            </div>
            <div className="text-[13px] leading-relaxed text-[#94a3b8]">
              Get three perspectives that will shift how you think
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="mb-6 sm:mb-8">
          <label
            htmlFor="argument"
            className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
          >
            Your argument or opinion
          </label>
          <div>
            <textarea
              id="argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Example: Social media is making society more divided... or paste any argument, opinion, or hot take you want to pressure-test."
              rows={6}
              className="min-h-[140px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-[16px] leading-relaxed text-[var(--text)] placeholder:text-[#334155] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-glow),inset_0_0_40px_rgba(37,99,235,0.03)] sm:min-h-[160px] sm:rounded-2xl sm:px-6 sm:py-5 sm:text-[15px]"
              disabled={loading}
            />
            <p className="mt-1.5 text-right text-[11px] text-[var(--muted)]">
              {argument.length} characters
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSteelman}
          disabled={loading}
          className="btn-pulse relative w-full overflow-hidden rounded-xl bg-[var(--blue)] py-4 text-[15px] font-semibold tracking-[0.05em] text-white transition-transform duration-150 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:animate-none disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-[52px] sm:py-[18px]"
        >
          <span className="relative z-10">
            {loading ? "Steelmanning..." : "⚡ Steelman It"}
          </span>
          <span
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
            aria-hidden
          />
        </button>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <>
            <div className="my-10 flex items-center gap-4 sm:my-14">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#64748b]">
                Results
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              <ResultCard
                type="steelman"
                icon="⚡"
                title="The Steelman"
                content={result.steelman}
              />
              <ResultCard
                type="counter"
                icon="🔴"
                title="The Counter-Steelman"
                content={result.counterSteelman}
              />
              <ResultCard
                type="kernel"
                icon="🟢"
                title="The Kernel"
                content={result.kernel}
              />

              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={handleShare}
                  className="min-h-[44px] min-w-[44px] px-3 text-xs text-[#64748b] transition-colors hover:text-[var(--text)]"
                >
                  Share Results
                </button>
                {copied && (
                  <span className="text-xs text-[#64748b]">Copied!</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="py-12 pb-8 text-center text-xs tracking-[0.05em] text-[#1e293b] sm:py-16 sm:pb-10">
        Built by Batman & Robin · March 2026
      </footer>
    </div>
  );
}

function ConceptBadge({
  dotColor,
  label,
  tooltip,
}: {
  dotColor: string;
  label: string;
  tooltip: string;
}) {
  return (
    <div
      className="group relative flex cursor-default items-center gap-2"
      title={tooltip}
    >
      <div
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)] group-hover:text-[var(--text)]">
        {label}
      </span>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-normal text-[var(--text)] opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
        {tooltip}
      </div>
    </div>
  );
}

function ResultCard({
  type,
  icon,
  title,
  content,
}: {
  type: "steelman" | "counter" | "kernel";
  icon: string;
  title: string;
  content: string;
}) {
  const styles = {
    steelman: {
      titleColor: "var(--amber)",
      iconBg: "rgba(217,119,6,0.15)",
    },
    counter: {
      titleColor: "var(--rose)",
      iconBg: "rgba(225,29,72,0.15)",
    },
    kernel: {
      titleColor: "var(--emerald)",
      iconBg: "rgba(5,150,105,0.15)",
    },
  };

  const s = styles[type];

  return (
    <article className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:rounded-[20px] sm:p-8">
      <div
        className="absolute left-0 right-0 top-0 h-0.5"
        style={{
          background:
            type === "steelman"
              ? "linear-gradient(90deg, var(--amber), transparent)"
              : type === "counter"
                ? "linear-gradient(90deg, var(--rose), transparent)"
                : "linear-gradient(90deg, var(--emerald), transparent)",
        }}
      />
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
          style={{ backgroundColor: s.iconBg }}
        >
          {icon}
        </div>
        <div
          className="text-[13px] font-bold uppercase tracking-[0.08em]"
          style={{ color: s.titleColor }}
        >
          {title}
        </div>
      </div>
      <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-[#94a3b8] [word-break:break-word]">
        {content}
      </div>
    </article>
  );
}
