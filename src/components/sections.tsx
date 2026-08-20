import { useState } from "react";
import {
  INTERVENTIONS,
  MECHANISMS,
  MECHANISM_ORDER,
  interventionById,
  type MechanismId,
  type SessionEntry,
  type WidgetId,
} from "../data";
import { Arrow, MechTag, Reveal, SectionHead, Spark } from "./chrome";

const WIDGET_LABEL: Record<WidgetId, string> = {
  breath: "guided breathing",
  checklist: "sense checklist",
  label: "emotion labeling",
  control: "sorting + planning",
  gratitude: "micro-journaling",
  compassion: "writing reframe",
  reachout: "message draft",
  future: "future-self writing",
};

/* ---------------- how it works ---------------- */

const LAYERS = [
  {
    n: "01",
    color: "#7cd9a6",
    title: "the inference layer",
    kicker: "you type chaos — it reads patterns",
    body: "A signal engine parses three things from your messy input: the situation you describe, the emotion language you use, and what you've already tried. It's a translator, not a therapist: vague distress becomes an identifiable pattern. No advice invented on the fly, ever.",
    tags: ["situation", "emotion language", "what you've tried"],
  },
  {
    n: "02",
    color: "#8fc9e8",
    title: "the mechanism layer",
    kicker: "same words, different roots",
    body: "“I feel unmotivated” could be lost momentum, low competence, or absent optimism — and each needs a different tool. This layer names the deficit underneath, then makes the intervention legible: not “here, try this exercise,” but “your sense of control took a hit — here's what restores that.” People engage when the why is explained.",
    tags: ["agency", "positive affect", "self-regard", "connection", "meaning"],
  },
  {
    n: "03",
    color: "#f4896b",
    title: "intervention delivery",
    kicker: "published science, digital dose",
    body: "Nothing here is AI-generated from scratch. Every tool is a micro, interactive version of an empirically tested positive psychology intervention — adapted to how attention actually works now: under five minutes, hands-on, with feedback you can feel. Unhealthy coping gets replaced, not lectured about.",
    tags: ["interactive", "< 5 minutes", "evidence-cited"],
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-5 py-20">
      <Reveal>
        <SectionHead
          tag="architecture"
          title={<>vague distress in.<br />named mechanism out.</>}
          desc="Three layers stand between your 2am brain dump and a research-backed tool in your hands. Each one earns its keep."
          color="#8fc9e8"
        />
      </Reveal>
      <div className="relative">
        <span className="absolute left-[27px] top-4 bottom-8 w-px bg-line hidden sm:block" aria-hidden />
        <div className="space-y-6">
          {LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 110}>
              <div className="relative sm:pl-20 group">
                <span
                  className="hidden sm:flex absolute left-0 top-1 w-[54px] h-[54px] rounded-full border items-center justify-center font-display font-bold text-lg bg-pine transition-transform duration-300 group-hover:scale-110"
                  style={{ borderColor: `${l.color}66`, color: l.color }}
                >
                  {l.n}
                </span>
                <div className="panel p-6 sm:p-7 transition-colors duration-300 hover:border-line2">
                  <p className="mono-label" style={{ color: l.color }}>{l.kicker}</p>
                  <h3 className="font-display font-bold text-ink text-2xl mt-1.5 tracking-tight">{l.title}</h3>
                  <p className="text-dim text-sm leading-relaxed mt-3 max-w-2xl">{l.body}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {l.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint border border-line rounded-full px-3 py-1 group-hover:text-dim transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- science: sequence rule + mechanisms ---------------- */

export function Science() {
  return (
    <section id="science" className="max-w-6xl mx-auto px-5 py-20">
      <Reveal>
        <SectionHead
          tag="the science bit"
          title={<>not all mechanisms are<br />equal <em className="italic font-light text-honey">at all times.</em></>}
          desc="There's a sequencing rule, and it's the difference between a tool that lands and one that bounces."
          color="#f0b45b"
        />
      </Reveal>

      <Reveal>
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-3">
            <GateNode color="#7cd9a6" gate="gate 1" title="safety" body="nervous system dysregulated? grounding first. gratitude cannot land on a body in alarm." />
            <GateArrow />
            <GateNode color="#8fc9e8" gate="gate 2" title="clarity" body="flooded or numb? label and name the feeling before anything can be matched." />
            <GateArrow />
            <div className="flex-1 rounded-xl border border-line p-5 bg-pine/40">
              <p className="mono-label text-honey">then — and only then</p>
              <p className="font-display font-semibold text-ink text-lg mt-1">growth mechanisms</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(["agency", "affect", "self", "connection", "meaning"] as MechanismId[]).map((m) => (
                  <span key={m} className="font-mono text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 border" style={{ color: MECHANISMS[m].color, borderColor: `${MECHANISMS[m].color}44`, background: `${MECHANISMS[m].color}10` }}>
                    {MECHANISMS[m].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="font-mono text-[11px] text-faint mt-5 leading-relaxed">
            ▸ if your heart is racing at 3am, we're not asking what you're grateful for. we're getting you breathing.
            the engine checks gates first — every time, for everyone.
          </p>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {MECHANISM_ORDER.map((id, i) => {
          const m = MECHANISMS[id];
          return (
            <Reveal key={id} delay={i * 70}>
              <div className="panel p-5 h-full transition-all duration-300 hover:-translate-y-1 group" style={{ borderColor: `${m.color}22` }}>
                <div className="flex items-center justify-between">
                  <span className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: m.color, boxShadow: `0 0 14px ${m.color}66` }} />
                  {m.gate && <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: m.color }}>gate {m.gate}</span>}
                </div>
                <p className="font-display font-bold text-ink text-xl mt-3 tracking-tight">{m.label}</p>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] mt-0.5" style={{ color: m.color }}>restores: {m.need}</p>
                <p className="text-dim text-[13px] leading-relaxed mt-3">{m.blurb}</p>
              </div>
            </Reveal>
          );
        })}
        <Reveal delay={7 * 70}>
          <div className="rounded-[16px] border border-dashed border-line2 p-5 h-full flex flex-col justify-center items-start">
            <Spark className="w-5 h-5 text-coral" />
            <p className="font-display font-bold text-ink text-xl mt-3 tracking-tight">one deficit, many ripples</p>
            <p className="text-dim text-[13px] leading-relaxed mt-2">
              strengthening one trait lifts several — optimism helps work <em>and</em> Tuesday mornings.
              that's why the engine picks the <span className="text-ink">single best lever</span> instead of dumping five exercises on you.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GateNode({ color, gate, title, body }: { color: string; gate: string; title: string; body: string }) {
  return (
    <div className="flex-1 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: `${color}44`, background: `${color}0d` }}>
      <p className="mono-label" style={{ color }}>{gate}</p>
      <p className="font-display font-bold text-ink text-xl mt-1 tracking-tight">{title}</p>
      <p className="text-dim text-[13px] leading-relaxed mt-2">{body}</p>
    </div>
  );
}
function GateArrow() {
  return (
    <div className="flex md:flex-col items-center justify-center text-faint">
      <Arrow className="w-5 h-5 rotate-90 md:rotate-0" />
    </div>
  );
}

/* ---------------- library ---------------- */

export function Library({ onLaunch }: { onLaunch: (id: string) => void }) {
  return (
    <section id="library" className="max-w-6xl mx-auto px-5 py-20">
      <Reveal>
        <SectionHead
          tag="the library"
          title={<>nine tools.<br />zero <em className="italic font-light text-coral">homework energy</em> required.</>}
          desc="Every intervention below is a published positive-psychology protocol, shrunk to a digital dose. Skip the inference engine and run any of them directly."
        />
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTERVENTIONS.map((iv, i) => {
          const m = MECHANISMS[iv.mechanism];
          return (
            <Reveal key={iv.id} delay={(i % 3) * 90}>
              <div className="panel p-5 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 group" style={{ borderColor: `${m.color}22` }}>
                <div className="flex items-center justify-between gap-2">
                  <MechTag id={iv.mechanism} small />
                  <span className="font-mono text-[10px] text-faint shrink-0">~{iv.minutes} min</span>
                </div>
                <h3 className="font-display font-bold text-ink text-xl mt-3 tracking-tight leading-snug">{iv.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.13em] mt-1.5" style={{ color: m.color }}>
                  {WIDGET_LABEL[iv.widget]}
                </p>
                <p className="text-dim text-[12.5px] leading-relaxed mt-3 flex-1 line-clamp-3">{iv.evidence}</p>
                <button
                  onClick={() => onLaunch(iv.id)}
                  className="btn-ghost px-4 py-2.5 text-[13px] font-mono mt-4 flex items-center justify-center gap-2 group-hover:border-coral/60 group-hover:text-coral"
                >
                  run it now <Arrow className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
          );
        })}
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
    <section className="max-w-6xl mx-auto px-5 py-20">
      <Reveal>
        <SectionHead
          tag="honest fine print"
          title={<>what this is.<br />what this <em className="italic font-light text-mint">isn't.</em></>}
          desc="Tools work better when you know exactly what you're holding. So: plainly."
          color="#7cd9a6"
        />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        <Reveal>
          <div className="panel p-6 sm:p-7 h-full border-mint/20">
            <p className="mono-label text-mint mb-4">what this is</p>
            <ul className="space-y-3.5">
              {IS_LIST.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-dim leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-mint/15 border border-mint/40 text-mint flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3 h-3"><path d="M4 12.5l5 5L20 6.5" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="panel p-6 sm:p-7 h-full border-coral/20">
            <p className="mono-label text-coral mb-4">what this isn't</p>
            <ul className="space-y-3.5">
              {ISNT_LIST.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-dim leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-coral/12 border border-coral/40 text-coral flex items-center justify-center shrink-0">
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
        <p className="font-display text-xl sm:text-2xl text-dim italic text-center mt-10 max-w-2xl mx-auto leading-snug">
          “modern problems require modern solutions — but the mechanisms underneath them are ancient,
          and they respond to small, proven moves.”
        </p>
      </Reveal>
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
    <section id="log" className="max-w-6xl mx-auto px-5 py-20">
      <Reveal>
        <SectionHead
          tag="your log"
          title={<>patterns beat<br />promises.</>}
          desc="Every completed session lands here — stored only in this browser. After a few rounds, your personal deficit profile starts showing up."
          color="#b7a3e4"
        />
      </Reveal>

      {entries.length === 0 ? (
        <Reveal>
          <div className="rounded-[16px] border border-dashed border-line2 p-10 text-center">
            <p className="font-mono text-[12px] text-faint">▸ no sessions logged yet</p>
            <p className="text-dim text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Run one round above — your mechanism pattern and heaviness deltas will build here.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-4">
            <div className="panel p-6 h-full">
              <p className="mono-label mb-4">your pattern</p>
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="font-display font-extrabold text-4xl text-ink tabular-nums">{entries.length}</p>
                  <p className="mono-label mt-0.5">sessions</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-4xl text-ink tabular-nums">{days}</p>
                  <p className="mono-label mt-0.5">days</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-4xl tabular-nums" style={{ color: avgDelta <= 0 ? "#7cd9a6" : "#f0b45b" }}>
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
                      <span className="flex-1 h-[6px] rounded-full bg-line/60 overflow-hidden">
                        <span
                          className="width-grow block h-full rounded-full"
                          style={{ width: `${(n / maxCount) * 100}%`, background: MECHANISMS[m].color, animationDelay: `${i * 80}ms` }}
                        />
                      </span>
                      <span className="font-mono text-[10px] text-faint w-4 text-right">{n}</span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => (confirming ? (onClear(), setConfirming(false)) : setConfirming(true))}
                className={`mt-6 font-mono text-[11px] px-4 py-2 rounded-full border transition-colors ${
                  confirming ? "border-coral/60 text-coral" : "border-line2 text-faint hover:text-dim"
                }`}
              >
                {confirming ? "tap again to wipe everything" : "clear log"}
              </button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={100}>
            <div className="panel p-6">
              <p className="mono-label mb-4">recent sessions</p>
              <ul className="divide-y divide-line/60">
                {entries.slice(0, 8).map((e) => {
                  const iv = interventionById(e.interventionId);
                  const d = e.after - e.before;
                  return (
                    <li key={e.id} className="py-3.5 flex items-center gap-4 flex-wrap">
                      <span className="font-mono text-[10.5px] text-faint w-24 shrink-0">
                        {new Date(e.ts).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                        {new Date(e.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <MechTag id={e.mechanism} small />
                      <span className="text-sm text-ink flex-1 min-w-[140px] truncate">
                        {iv.title}
                        {e.manual && <span className="font-mono text-[10px] text-faint ml-2">(library)</span>}
                      </span>
                      {!e.manual && <span className="text-[12px] text-faint italic truncate max-w-[180px] hidden md:block">“{e.snippet}”</span>}
                      <span className="font-mono text-[11px] tabular-nums shrink-0">
                        <span className="text-coral">{e.before}</span>
                        <span className="text-faint"> → </span>
                        <span className="text-mint">{e.after}</span>
                      </span>
                      <span
                        className="font-mono text-[10.5px] rounded-full px-2 py-0.5 border shrink-0"
                        style={
                          d <= 0
                            ? { color: "#7cd9a6", borderColor: "#7cd9a655", background: "#7cd9a614" }
                            : { color: "#f0b45b", borderColor: "#f0b45b55", background: "#f0b45b14" }
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
    </section>
  );
}
