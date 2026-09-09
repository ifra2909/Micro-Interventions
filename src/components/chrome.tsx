import { type ReactNode } from "react";
import { useRevealRef } from "../hooks";
import { MECHANISMS, type MechanismId } from "../data";

/* ---------------- header ---------------- */

export function Header({ sessionCount }: { sessionCount: number }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#C2CBD4] bg-[#E4E8EC]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#" className="flex items-baseline gap-2">
          <span className="font-display text-[26px] text-[#17202A]">Microshift</span>
        </a>
        <div className="flex items-center gap-3">
          {sessionCount > 0 && (
            <span className="mono-label text-[#4A5868] border border-[#C2CBD4] rounded-full px-3 py-1">
              {sessionCount} session{sessionCount === 1 ? "" : "s"} logged
            </span>
          )}
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

export function SectionHead({ tag, title, desc, color = "#17202A" }: { tag: string; title: ReactNode; desc?: string; color?: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <p className="mono-label flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
        {tag}
      </p>
      <h2 className="font-display text-[#17202A] mt-3 leading-[1.1] text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      {desc && <p className="text-[#4A5868] mt-4 text-[15px] leading-relaxed">{desc}</p>}
    </div>
  );
}

export function MechTag({ id, small = false }: { id: MechanismId; small?: boolean }) {
  const m = MECHANISMS[id];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-[0.1em] ${small ? "text-[10px] px-2.5 py-1" : "text-[11px] px-3 py-1.5"}`}
      style={{ color: "#17202A", background: m.color, border: `1px solid ${m.color}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#17202A", opacity: 0.5 }} />
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

export function Footer() {
  return (
    <footer className="border-t border-[#C2CBD4] mt-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 grid gap-10 md:grid-cols-2">
        <div>
          <p className="font-display text-2xl text-[#17202A]">Microshift</p>
          <p className="text-[#4A5868] text-sm mt-3 leading-relaxed max-w-xs">
            Evidence-based emotional regulation for everyday modern stress. Not therapy, not a diagnosis,
            not another chatbot — just a better ten minutes.
          </p>
        </div>
        <div>
          <p className="mono-label mb-3">if it's bigger than a bad day</p>
          <div className="panel p-4" style={{ background: "#D4B4A820" }}>
            <p className="text-sm text-[#17202A] leading-relaxed">
              <span className="text-[#17202A] font-medium">India:</span>{" "}
              <a href="tel:9152987821" className="underline hover:text-[#17202A] transition-colors">
                iCall: 9152987821
              </a>
              <br />
              <span className="text-[#17202A] font-medium">Vandrevala Foundation:</span>{" "}
              <a href="tel:18602662345" className="underline hover:text-[#17202A] transition-colors">
                1860-2662-345
              </a>
            </p>
            <p className="mono-label mt-3 normal-case tracking-normal text-[11px]">
              this tool is a momentary lever, not treatment. if distress persists, a human professional beats any algorithm.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
