import { Link } from "wouter";

export default function EraCodex() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">📜</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Era Codex
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          The Era Codex chronicles the evolution of the Trust Layer ecosystem. This page is currently under construction.
        </p>
        <Link href="/">
          <a className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity">
            ← Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}
