import { useMemo, type ReactNode } from "react";
import { useRevealRef } from "../hooks";
import { MECHANISMS, type MechanismId } from "../data";

/* ---------------- ambient background ---------------- */

export function Ambient() {
  const motes = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 61) % 100}%`,
        top: `${(i * 37 + 12) % 100}%`,
        size: 2 + (i % 3),
        delay: `${(i * 1.7) % 9}s`,
        dur: `${9 + (i % 5) * 2.4}s`,
      })),
    []
  );
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-pine" aria-hidden>
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 20% -10%, #12271d 0%, #0a1410 55%)" }} />
      <div className="glow-a absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] rounded-full blur-3xl opacity-60" style={{ background: "radial-gradient(circle, #17453466 0%, transparent 65%)" }} />
      <div className="glow-b absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, #3d2f1466 0%, transparent 65%)" }} />
      <div className="glow-c absolute bottom-[-25%] left-[25%] w-[55vw] h-[55vw] rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #14324266 0%, transparent 65%)" }} />
      {/* faint topographic rings */}
      <svg className="absolute top-24 right-[-140px] w-[560px] h-[560px] opacity-[0.05]" viewBox="0 0 200 200" fill="none">
        {[30, 45, 60, 75, 90].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="#7cd9a6" strokeWidth="0.4" strokeDasharray="2 5" />
        ))}
      </svg>
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote absolute rounded-full bg-mint/60"
          style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: m.delay, animationDuration: m.dur }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 50% 110%, #0a141000 0%, #070e0b 100%)" }} />
    </div>
  );
}

/* ---------------- shared bits ---------------- */

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRevealRef<HTMLDivElement>();
  return (
    <div ref={ref} data-rv className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({ tag, title, desc, color = "#f4896b" }: { tag: string; title: ReactNode; desc?: string; color?: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <p className="mono-label flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
        {tag}
      </p>
      <h2 className="font-display font-bold text-ink mt-3 leading-[1.04] text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {desc && <p className="text-dim mt-4 text-[15px] leading-relaxed">{desc}</p>}
    </div>
  );
}

export function MechTag({ id, small = false }: { id: MechanismId; small?: boolean }) {
  const m = MECHANISMS[id];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.14em] ${small ? "text-[10px] px-2 py-0.5" : "text-[11px] px-3 py-1"}`}
      style={{ color: m.color, borderColor: `${m.color}55`, background: `${m.color}14` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export const Spark = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z" />
  </svg>
);
export const Arrow = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Check = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12.5l5 5L20 6.5" className="draw-check" />
  </svg>
);

/* ---------------- header ---------------- */

export function Header({ sessionCount }: { sessionCount: number }) {
  const links = [
    ["tool", "#tool"],
    ["how", "#how"],
    ["science", "#science"],
    ["library", "#library"],
    ["log", "#log"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-pine/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="#tool" className="flex items-baseline gap-2 group">
          <span className="font-display font-extrabold text-[22px] tracking-tight text-ink">
            ppis<span className="text-coral transition-transform inline-block group-hover:rotate-90 origin-center">*</span>
          </span>
          <span className="mono-label hidden sm:block">micro-interventions</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="mono-label hover:text-ink transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="mono-label text-dim border border-line rounded-full px-3 py-1">
            {sessionCount} session{sessionCount === 1 ? "" : "s"} logged
          </span>
          <span className="hidden lg:flex items-center gap-1.5 mono-label text-honey">
            <span className="relative flex w-2 h-2">
              <span className="pulse-ring absolute inline-flex w-full h-full rounded-full bg-honey" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-honey" />
            </span>
            crisis? 988
          </span>
        </div>
      </div>
    </header>
  );
}

/* ---------------- marquee ---------------- */

const PHRASES = [
  "it's never that serious",
  "your ancestors handled worse",
  "breathe first, solve second",
  "name it to tame it",
  "small lever, real shift",
  "feel better — then handle it",
  "you are very much capable",
  "monkey brain, modern problems",
];

export function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex items-center gap-8 pr-8 shrink-0">
      {PHRASES.map((p) => (
        <span key={p} className="flex items-center gap-8 font-display text-lg sm:text-xl font-semibold text-dim whitespace-nowrap">
          {p}
          <Spark className="w-3.5 h-3.5 text-coral/70" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="border-y border-line/70 bg-pine2/60 py-4 overflow-hidden">
      <div className="marquee-track flex w-max">{[row("a"), row("b")]}</div>
    </div>
  );
}

/* ---------------- footer ---------------- */

export function Footer({ citations }: { citations: string[] }) {
  return (
    <footer className="border-t border-line/70 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display font-extrabold text-2xl text-ink">
            ppis<span className="text-coral">*</span>
          </p>
          <p className="text-dim text-sm mt-3 leading-relaxed max-w-xs">
            Evidence-based emotional regulation for everyday modern stress. Not therapy, not a diagnosis,
            not another chatbot to trauma-dump into — just a better ten minutes.
          </p>
        </div>
        <div>
          <p className="mono-label mb-3">if it's bigger than a bad day</p>
          <div className="panel p-4">
            <p className="text-sm text-ink leading-relaxed">
              <span className="text-honey font-semibold">US:</span> call or text <span className="font-mono">988</span> · text <span className="font-mono">HOME</span> to <span className="font-mono">741741</span>
              <br />
              <span className="text-honey font-semibold">Elsewhere:</span>{" "}
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline decoration-honey/50 hover:text-honey transition-colors">
                findahelpline.com
              </a>
            </p>
            <p className="mono-label mt-3 normal-case tracking-normal text-[11px]">
              this tool is a momentary lever, not treatment. if distress persists, a human professional beats any algorithm.
            </p>
          </div>
        </div>
        <div>
          <p className="mono-label mb-3">standing on the shoulders of</p>
          <ul className="space-y-2">
            {citations.map((c) => (
              <li key={c} className="text-[12px] font-mono text-faint leading-snug">
                <span className="text-mint/70">▸</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60 py-5 text-center mono-label">
        ppis · made for monkey brains with modern problems · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
