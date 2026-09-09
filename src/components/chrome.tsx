import { type ReactNode } from "react";
import { useRevealRef } from "../hooks";
import { MECHANISMS, type MechanismId } from "../data";

/* ---------------- header ---------------- */

export function Header({ sessionCount }: { sessionCount: number }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#" className="flex items-baseline gap-2">
          <span className="font-display text-[26px] text-ink">ppis</span>
          <span className="mono-label hidden sm:block">micro-interventions</span>
        </a>
        <div className="flex items-center gap-3">
          {sessionCount > 0 && (
            <span className="mono-label text-ink-muted border border-border rounded-full px-3 py-1">
              {sessionCount} session{sessionCount === 1 ? "" : "s"} logged
            </span>
          )}
          <span className="hidden md:flex items-center gap-1.5 mono-label text-amber">
            <span className="relative flex w-2 h-2">
              <span className="pulse-ring absolute inline-flex w-full h-full rounded-full bg-amber" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-amber" />
            </span>
            crisis? 988
          </span>
        </div>
      </div>
    </header>
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

export function SectionHead({ tag, title, desc, color = "#1a1a1a" }: { tag: string; title: ReactNode; desc?: string; color?: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <p className="mono-label flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
        {tag}
      </p>
      <h2 className="font-display text-ink mt-3 leading-[1.1] text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      {desc && <p className="text-ink-light mt-4 text-[15px] leading-relaxed">{desc}</p>}
    </div>
  );
}

export function MechTag({ id, small = false }: { id: MechanismId; small?: boolean }) {
  const m = MECHANISMS[id];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.1em] ${small ? "text-[10px] px-2 py-0.5" : "text-[11px] px-3 py-1"}`}
      style={{ color: m.color, borderColor: `${m.color}44`, background: `${m.color}10` }}
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

/* ---------------- footer ---------------- */

export function Footer({ citations }: { citations: string[] }) {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-ink">ppis</p>
          <p className="text-ink-light text-sm mt-3 leading-relaxed max-w-xs">
            Evidence-based emotional regulation for everyday modern stress. Not therapy, not a diagnosis,
            not another chatbot — just a better ten minutes.
          </p>
        </div>
        <div>
          <p className="mono-label mb-3">if it's bigger than a bad day</p>
          <div className="panel p-4">
            <p className="text-sm text-ink leading-relaxed">
              <span className="text-amber font-medium">US:</span> call or text <span className="font-mono">988</span> · text <span className="font-mono">HOME</span> to <span className="font-mono">741741</span>
              <br />
              <span className="text-amber font-medium">Elsewhere:</span>{" "}
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline decoration-amber/40 hover:text-amber transition-colors">
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
              <li key={c} className="text-[12px] font-mono text-ink-muted leading-snug">
                <span className="text-sage">▸</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center mono-label">
        ppis · made for monkey brains with modern problems · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
