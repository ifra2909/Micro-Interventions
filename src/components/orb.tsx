interface OrbProps {
  color: string;
  speed?: number;
  size?: number;
  label?: string;
  sub?: string;
  scale?: number;
  phaseLabel?: string;
}

export function BreathOrb({ color, speed = 7, size = 200, label, sub, scale, phaseLabel }: OrbProps) {
  const guided = scale !== undefined;
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <span className="pulse-ring absolute inset-4 rounded-full" style={{ border: `1px solid ${color}33` }} />
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }}
        />
        <div
          className="absolute inset-6 rounded-full transition-transform duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle at 34% 30%, ${color}cc 0%, ${color}44 42%, ${color}10 78%)`,
            boxShadow: `0 0 50px ${color}25, inset 0 -12px 24px rgba(0,0,0,0.06)`,
            animation: guided ? "none" : `breathe-ambient ${speed}s ease-in-out infinite`,
            transform: guided ? `scale(${scale})` : undefined,
          }}
        />
        <div
          className="absolute rounded-full bg-white/80 blur-[2px] transition-transform duration-1000 ease-in-out"
          style={{
            width: size * 0.12,
            height: size * 0.12,
            left: "50%",
            top: "50%",
            marginLeft: -size * 0.06,
            marginTop: -size * 0.06,
            animation: guided ? "none" : `breathe-ambient ${speed}s ease-in-out infinite`,
            transform: guided ? `scale(${1 + (scale - 1) * 0.5})` : undefined,
          }}
        />
        {(label || phaseLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-body font-medium text-[#17202A] text-sm tracking-wide">
              {phaseLabel ?? label}
            </span>
            {sub && !guided && <span className="mono-label mt-1">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
