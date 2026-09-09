import { useState } from "react";
import {
  INTERVENTIONS,
  MECHANISMS,
  MECHANISM_ORDER,
  interventionById,
  type SessionEntry,
} from "../data";
import { Arrow, MechTag, Reveal, SectionHead } from "./chrome";

/* ---------------- science section ---------------- */

export function Science() {
  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #E4E8EC 0%, #DDE2E7 50%, #E4E8EC 100%)" }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Reveal>
          <SectionHead
            tag="backed by science"
            title={<>every intervention is<br /><em className="italic text-[#4A5868]">research-backed.</em></>}
            desc="14 micro-interventions drawn from peer-reviewed positive psychology research. Each one is a digital adaptation of an empirically tested technique."
            color="#17202A"
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="panel p-7">
            <p className="text-[#4A5868] text-sm leading-relaxed mb-5">
              Microshift doesn't invent exercises. Every tool here is adapted from published research in positive psychology, 
              cognitive behavioral therapy, and mindfulness-based interventions. We've distilled decades of clinical research 
              into 2-5 minute micro-interventions that actually fit into your day.
            </p>
            <a href="#/science" className="btn-main px-6 py-2.5 text-sm inline-flex items-center gap-2">
              view the research <Arrow className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- what this is / isn't ---------------- */

const IS_LIST = [
  "evidence-based emotional regulation for everyday modern stress",
  "vague emotional distress → one actionable micro-intervention",
  "a way to feel better in the moment, so you can handle what's already handleable",
  "a healthier stand-in for doomscrolling, drinking, and avoidance loops",
  "inexpensive, simple, and built to promote healthy functioning",
];
const ISNT_LIST = [
  "another mental-health AI chatbot. god no.",
  "a fix for deep avoidance, attachment, or trauma work",
  "therapy, diagnosis, or medical advice of any kind",
  "a crisis tool — it's a lever for bad days, not a lifeline",
  "AI inventing exercises from scratch — everything ships from published research",
];

export function IsIsNot() {
  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #E4E8EC 0%, #DDE2E7 50%, #E4E8EC 100%)" }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Reveal>
        <SectionHead
          tag="Honest disclaimer"
          title={<>what this is.<br /><em className="italic text-[#4A5868]">what this isn't.</em></>}
          color="#17202A"
        />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-5">
        <Reveal>
          <div className="panel p-7 h-full" style={{ background: "#A8C4BC20" }}>
            <p className="mono-label text-[#17202A] mb-5">what this is</p>
            <ul className="space-y-4">
              {IS_LIST.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-[#17202A] leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#A8C4BC] border border-[#A8C4BC] text-[#17202A] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3 h-3"><path d="M4 12.5l5 5L20 6.5" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="panel p-7 h-full" style={{ background: "#D4B4A820" }}>
            <p className="mono-label text-[#17202A] mb-5">what this isn't</p>
            <ul className="space-y-4">
              {ISNT_LIST.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-[#17202A] leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#D4B4A8] border border-[#D4B4A8] text-[#17202A] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3 h-3"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <Reveal delay={180}>
        <p className="font-display text-xl sm:text-2xl text-[#4A5868] italic text-center mt-12 max-w-2xl mx-auto leading-snug">
          "modern problems require modern solutions — but the mechanisms underneath them are ancient,
          and they respond to small, proven moves."
        </p>
      </Reveal>
      </div>
    </section>
  );
}

/* ---------------- log ---------------- */

export function Log({ entries, onClear }: { entries: SessionEntry[]; onClear: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const days = new Set(entries.map((e) => new Date(e.ts).toDateString())).size;
  const avgDelta = entries.length
    ? entries.reduce((n, e) => n + (e.after - e.before), 0) / entries.length
    : 0;

  const mechCounts = MECHANISM_ORDER.map((m) => ({
    m,
    n: entries.filter((e) => e.mechanism === m).length,
  })).filter((x) => x.n > 0);
  const maxCount = Math.max(1, ...mechCounts.map((x) => x.n));

  return (
    <section id="log" className="py-24" style={{ background: "linear-gradient(180deg, #E4E8EC 0%, #DDE2E7 50%, #E4E8EC 100%)" }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Reveal>
        <SectionHead
          tag="your log"
          title={<>patterns beat<br /><em className="italic text-[#4A5868]">promises.</em></>}
          desc="Every completed session lands here — stored only in this browser. After a few rounds, your personal deficit profile starts showing up."
          color="#17202A"
        />
      </Reveal>

      {entries.length === 0 ? (
        <Reveal>
          <div className="rounded-2xl border border-dashed border-[#C2CBD4] p-12 text-center">
            <p className="font-mono text-[12px] text-[#4A5868]">▸ no sessions logged yet</p>
            <p className="text-[#4A5868] text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Run one round above — your mechanism pattern and heaviness deltas will build here.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-4">
            <div className="panel p-7 h-full">
              <p className="mono-label mb-5">your pattern</p>
              <div className="flex gap-8 mb-7">
                <div>
                  <p className="font-display text-4xl text-[#17202A]">{entries.length}</p>
                  <p className="mono-label mt-0.5">sessions</p>
                </div>
                <div>
                  <p className="font-display text-4xl text-[#17202A]">{days}</p>
                  <p className="mono-label mt-0.5">days</p>
                </div>
                <div>
                  <p className="font-display text-4xl text-[#17202A]">
                    {avgDelta <= 0 ? `−${Math.abs(avgDelta).toFixed(1)}` : `+${avgDelta.toFixed(1)}`}
                  </p>
                  <p className="mono-label mt-0.5">avg Δ</p>
                </div>
              </div>
              <p className="mono-label mb-3">mechanisms hit, most first</p>
              <div className="space-y-2.5">
                {mechCounts
                  .sort((a, b) => b.n - a.n)
                  .map(({ m, n }, i) => (
                    <div key={m} className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider w-[92px] shrink-0" style={{ color: MECHANISMS[m].color }}>
                        {MECHANISMS[m].label}
                      </span>
                      <span className="flex-1 h-[5px] rounded-full bg-[#C2CBD4] overflow-hidden">
                        <span
                          className="width-grow block h-full rounded-full"
                          style={{ width: `${(n / maxCount) * 100}%`, background: MECHANISMS[m].color, animationDelay: `${i * 80}ms` }}
                        />
                      </span>
                      <span className="font-mono text-[10px] text-[#4A5868] w-4 text-right">{n}</span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => (confirming ? (onClear(), setConfirming(false)) : setConfirming(true))}
                className={`mt-7 font-mono text-[11px] px-4 py-2 rounded-full border transition-colors ${
                  confirming ? "border-[#D4B4A8]/50 text-[#D4B4A8]" : "border-[#C2CBD4] text-[#4A5868] hover:text-[#17202A]"
                }`}
              >
                {confirming ? "tap again to wipe everything" : "clear log"}
              </button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={100}>
            <div className="panel p-7">
              <p className="mono-label mb-5">recent sessions</p>
              <ul className="divide-y divide-[#C2CBD4]">
                {entries.slice(0, 8).map((e) => {
                  const iv = interventionById(e.interventionId);
                  const d = e.after - e.before;
                  return (
                    <li key={e.id} className="py-4 flex items-center gap-4 flex-wrap">
                      <span className="font-mono text-[10.5px] text-[#4A5868] w-24 shrink-0">
                        {new Date(e.ts).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                        {new Date(e.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <MechTag id={e.mechanism} small />
                      <span className="text-sm text-[#17202A] flex-1 min-w-[140px] truncate">
                        {iv.title}
                        {e.manual && <span className="font-mono text-[10px] text-[#4A5868] ml-2">(library)</span>}
                      </span>
                      {!e.manual && <span className="text-[12px] text-[#4A5868] italic truncate max-w-[180px] hidden md:block">"{e.snippet}"</span>}
                      <span className="font-mono text-[11px] tabular-nums shrink-0">
                        <span className="text-[#D4B4A8]">{e.before}</span>
                        <span className="text-[#4A5868]"> → </span>
                        <span className="text-[#A8C4BC]">{e.after}</span>
                      </span>
                      <span
                        className="font-mono text-[10.5px] rounded-full px-2.5 py-1 shrink-0 text-espresso"
                        style={
                          d <= 0
                            ? { background: "#B8D4C8" }
                            : { background: "#E8D4B8" }
                        }
                      >
                        {d <= 0 ? `−${Math.abs(d)}` : `+${d}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      )}
      </div>
    </section>
  );
}
