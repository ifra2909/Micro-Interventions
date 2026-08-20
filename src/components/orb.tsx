interface OrbProps {
  color: string;
  /** seconds per breath cycle */
  speed?: number;
  size?: number;
  label?: string;
  sub?: string;
  /** fixed scale override (guided mode) */
  scale?: number;
  phaseLabel?: string;
}

/** The breathing presence of the page. Ambient = CSS-driven; guided = scale prop. */
export function BreathOrb({ color, speed = 7, size = 210, label, sub, scale, phaseLabel }: OrbProps) {
  const guided = scale !== undefined;
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* pulse rings */}
        <span className="pulse-ring absolute inset-4 rounded-full" style={{ border: `1px solid ${color}55` }} />
        <span className="pulse-ring absolute inset-4 rounded-full" style={{ border: `1px solid ${color}33`, animationDelay: "1.2s" }} />
        {/* halo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${color}3d 0%, transparent 70%)` }}
        />
        {/* body */}
        <div
          className="absolute inset-6 rounded-full transition-transform duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle at 34% 30%, ${color}e6 0%, ${color}66 42%, ${color}1f 78%)`,
            boxShadow: `0 0 60px ${color}40, inset 0 -14px 30px rgba(0,0,0,0.35)`,
            animation: guided ? "none" : `breathe-ambient ${speed}s ease-in-out infinite`,
            transform: guided ? `scale(${scale})` : undefined,
          }}
        />
        {/* core */}
        <div
          className="absolute rounded-full bg-white/85 blur-[2px] transition-transform duration-1000 ease-in-out"
          style={{
            width: size * 0.14,
            height: size * 0.14,
            left: "50%",
            top: "50%",
            marginLeft: -size * 0.07,
            marginTop: -size * 0.07,
            animation: guided ? "none" : `breathe-ambient ${speed}s ease-in-out infinite`,
            transform: guided ? `scale(${1 + (scale - 1) * 0.5})` : undefined,
          }}
        />
        {/* center label */}
        {(label || phaseLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-display font-semibold text-ink text-sm tracking-wide drop-shadow">
              {phaseLabel ?? label}
            </span>
            {sub && !guided && <span className="mono-label mt-1">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
