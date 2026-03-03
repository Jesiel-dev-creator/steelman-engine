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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            The Steelman Engine
          </h1>
          <p className="mt-3 text-lg text-zinc-400">
            Paste any argument or opinion. We&apos;ll steelman it, counter it,
            and extract the kernel.
          </p>
        </header>

        <div className="mb-8 flex justify-center gap-6 text-xs text-zinc-500">
          <span
            title="The strongest, most charitable version of the argument. No strawmen."
            className="cursor-default"
          >
            ⚡ Steelman
          </span>
          <span
            title="The strongest possible case against it. The best your opponents could ever make."
            className="cursor-default"
          >
            🔴 Counter-Steelman
          </span>
          <span
            title="The core truth both sides are actually circling. What the real disagreement is about."
            className="cursor-default"
          >
            🟢 Kernel
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="argument"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Your argument or opinion
            </label>
            <textarea
              id="argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Paste or type your argument here..."
              rows={6}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSteelman}
            disabled={loading}
            className="w-full rounded-xl bg-[#2563EB] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Steelmanning..." : "Steelman It"}
          </button>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-6 pt-4">
              <ResultCard
                title="The Steelman"
                content={result.steelman}
                accent="amber"
              />
              <ResultCard
                title="The Counter-Steelman"
                content={result.counterSteelman}
                accent="rose"
              />
              <ResultCard
                title="The Kernel"
                content={result.kernel}
                accent="emerald"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  content,
  accent,
}: {
  title: string;
  content: string;
  accent: "amber" | "rose" | "emerald";
}) {
  const accentStyles = {
    amber: "border-amber-500/30 bg-amber-950/10",
    rose: "border-rose-500/30 bg-rose-950/10",
    emerald: "border-emerald-500/30 bg-emerald-950/10",
  };

  const titleStyles = {
    amber: "text-amber-400",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
  };

  return (
    <article
      className={`rounded-xl border ${accentStyles[accent]} p-6 shadow-lg`}
    >
      <h2 className={`mb-4 text-lg font-semibold ${titleStyles[accent]}`}>
        {title}
      </h2>
      <div className="prose prose-invert prose-zinc max-w-none text-zinc-300">
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </article>
  );
}
