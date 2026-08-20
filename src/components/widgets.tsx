import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Intervention } from "../data";

interface WidgetProps {
  intervention: Intervention;
  onProgress: (p: number) => void;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* ---------------- breathing pacer (physiological sigh) ---------------- */

const PHASES = [
  { label: "in — through the nose", dur: 2.4, scale: 1.16 },
  { label: "sip a little more", dur: 1.1, scale: 1.3 },
  { label: "long exhale — mouth", dur: 5.6, scale: 1.0 },
];
const TARGET_ROUNDS = 6;

export function BreathWidget({ onProgress }: WidgetProps) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (done) onProgress(1);
    else onProgress(clamp01(round / TARGET_ROUNDS));
  }, [round, done, onProgress]);

  useEffect(() => {
    if (!running) return;
    const p = PHASES[phase];
    timer.current = window.setTimeout(() => {
      if (phase === PHASES.length - 1) {
        const next = round + 1;
        if (next >= TARGET_ROUNDS) {
          setRunning(false);
          setDone(true);
          return;
        }
        setRound(next);
      }
      setPhase((phase + 1) % PHASES.length);
    }, p.dur * 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, phase, round]);

  const p = PHASES[phase];
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <span className="pulse-ring absolute inset-0 rounded-full border border-mint/40" />
        <div
          className="w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #7cd9a6e6, #7cd9a655 55%, #7cd9a61a)",
            boxShadow: "0 0 50px #7cd9a645, inset 0 -10px 24px rgba(0,0,0,0.35)",
            transform: `scale(${running || round > 0 || done ? p.scale : 1})`,
            transition: `transform ${p.dur}s cubic-bezier(0.45, 0, 0.35, 1)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-display font-semibold text-ink text-sm px-4">{done ? "well done" : running ? p.label : "ready when you are"}</span>
          <span className="mono-label mt-1">round {Math.min(round + (done ? 0 : 1), TARGET_ROUNDS)} / {TARGET_ROUNDS}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!done && (
          <button onClick={() => setRunning(!running)} className="btn-main px-6 py-2.5 text-sm">
            {running ? "pause" : round > 0 ? "resume" : "start breathing"}
          </button>
        )}
        {!done && (
          <button onClick={() => setDone(true)} className="btn-ghost px-5 py-2.5 text-sm font-mono">
            already calmer — skip
          </button>
        )}
        {done && <p className="font-mono text-mint text-sm">✓ nervous system: notified</p>}
      </div>
      <div className="w-full max-w-xs h-1 rounded-full bg-line/70 overflow-hidden">
        <div className="h-full bg-mint rounded-full transition-all duration-700" style={{ width: `${(done ? 1 : clamp01(round / TARGET_ROUNDS)) * 100}%` }} />
      </div>
    </div>
  );
}

/* ---------------- generic checklist (5-4-3-2-1, unclench) ---------------- */

export function ChecklistWidget({ intervention, onProgress }: WidgetProps) {
  const groups = intervention.checklist ?? [];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    onProgress(clamp01(checked.size / total));
  }, [checked, total, onProgress]);

  let idx = 0;
  return (
    <div className="space-y-5 py-2">
      {groups.map((g) => (
        <div key={g.group}>
          <p className="mono-label mb-2">{g.group}</p>
          <div className="flex flex-wrap gap-2">
            {g.items.map((item) => {
              const key = `${g.group}:${idx++}`;
              const on = checked.has(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    const next = new Set(checked);
                    on ? next.delete(key) : next.add(key);
                    setChecked(next);
                  }}
                  className={`px-3.5 py-2 rounded-full border text-sm transition-all duration-200 ${
                    on
                      ? "bg-mint/15 border-mint/60 text-mint translate-y-0"
                      : "border-line2 text-dim hover:border-mint/50 hover:text-ink hover:-translate-y-0.5"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- affect labeling ---------------- */

const LABEL_BOARD: { word: string; color: string }[] = [
  ["anxious", "#8fc9e8"], ["overwhelmed", "#7cd9a6"], ["sad", "#8fc9e8"], ["angry", "#f4896b"],
  ["ashamed", "#e790a6"], ["lonely", "#efb990"], ["numb", "#b7a3e4"], ["exhausted", "#f0b45b"],
  ["guilty", "#e790a6"], ["scared", "#8fc9e8"], ["resentful", "#f4896b"], ["empty", "#b7a3e4"],
  ["embarrassed", "#e790a6"], ["worried", "#8fc9e8"], ["frustrated", "#f4896b"], ["drained", "#f0b45b"],
  ["left out", "#efb990"], ["dreading", "#8fc9e8"], ["inadequate", "#e790a6"], ["flat", "#b7a3e4"],
].map(([word, color]) => ({ word, color }));

export function LabelWidget({ onProgress }: WidgetProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(6);
  const [because, setBecause] = useState("");

  useEffect(() => {
    const p = (picked.length > 0 ? 0.45 : 0) + (because.trim().length > 3 ? 0.55 : picked.length >= 3 ? 0.25 : 0);
    onProgress(clamp01(p));
  }, [picked, because, onProgress]);

  const toggle = (w: string) =>
    setPicked((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : prev.length >= 3 ? prev : [...prev, w]));

  return (
    <div className="space-y-5 py-2">
      <div>
        <p className="mono-label mb-2">which words flinch? pick up to 3</p>
        <div className="flex flex-wrap gap-2">
          {LABEL_BOARD.map(({ word, color }) => {
            const on = picked.includes(word);
            return (
              <button
                key={word}
                onClick={() => toggle(word)}
                className="px-3.5 py-1.5 rounded-full border text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={
                  on
                    ? { background: `${color}22`, borderColor: `${color}88`, color }
                    : { borderColor: "#2f4a3b", color: "#a3bcad" }
                }
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
      {picked.length > 0 && (
        <div className="pop-in">
          <p className="mono-label mb-2">
            how loud is it? <span className="text-sky normal-case tracking-normal">{intensity}/10</span>
          </p>
          <input type="range" min={1} max={10} value={intensity} onChange={(e) => setIntensity(+e.target.value)} className="mood" />
        </div>
      )}
      <div>
        <p className="mono-label mb-2">finish the sentence — one line is plenty</p>
        <div className="inset-screen p-4">
          <p className="text-sm text-dim mb-2 font-mono">
            right now I feel <span className="text-sky">{picked.length ? picked.join(" + ") : "…"}</span>
            {because.trim() && <> because…</>}
          </p>
          <textarea
            value={because}
            onChange={(e) => setBecause(e.target.value)}
            rows={2}
            placeholder="because…"
            className="w-full bg-transparent border-b border-line2 focus:border-sky outline-none text-ink text-sm resize-none placeholder:text-faint transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- control audit ---------------- */

export function ControlWidget({ onProgress }: WidgetProps) {
  const [rows, setRows] = useState([{ text: "", tag: null as null | "mine" | "not" }, { text: "", tag: null as null | "mine" | "not" }, { text: "", tag: null as null | "mine" | "not" }]);
  const [action, setAction] = useState("");
  const [when, setWhen] = useState("");

  useEffect(() => {
    const tagged = rows.filter((r) => r.text.trim() && r.tag).length;
    onProgress(clamp01((tagged + (action.trim() ? 1 : 0) + (when.trim() ? 1 : 0)) / 5));
  }, [rows, action, when, onProgress]);

  return (
    <div className="space-y-5 py-2">
      <div>
        <p className="mono-label mb-2">what's swirling? tag each: mine / not mine</p>
        <div className="space-y-2.5">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={r.text}
                onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                placeholder={`swirl #${i + 1}`}
                className="flex-1 bg-panel2 border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-honey transition-colors"
              />
              <div className="flex rounded-full border border-line overflow-hidden shrink-0">
                {(["mine", "not"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRows(rows.map((x, j) => (j === i ? { ...x, tag: x.tag === t ? null : t } : x)))}
                    className={`px-3 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                      r.tag === t ? (t === "mine" ? "bg-honey text-pine" : "bg-line2 text-dim") : "text-faint hover:text-ink"
                    }`}
                  >
                    {t === "mine" ? "mine" : "not mine"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-faint mt-2 font-mono">'not mine' ≠ doesn't matter. it means not yours to grip today.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="mono-label mb-2">one next action that IS yours</p>
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g. draft the first 3 slides"
            className="w-full bg-panel2 border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-honey transition-colors"
          />
        </div>
        <div>
          <p className="mono-label mb-2">pin it to a when + where</p>
          <input
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="e.g. tomorrow, 9am, at my desk"
            className="w-full bg-panel2 border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-honey transition-colors"
          />
        </div>
      </div>
      {action.trim() && when.trim() && (
        <p className="pop-in font-mono text-sm text-honey">
          ⚑ plan set: <span className="text-ink">{action.trim()}</span> — {when.trim()}. that's a 2–3× follow-through pattern.
        </p>
      )}
    </div>
  );
}

/* ---------------- three good things ---------------- */

export function GratitudeWidget({ onProgress }: WidgetProps) {
  const [rows, setRows] = useState([
    { what: "", why: "" },
    { what: "", why: "" },
    { what: "", why: "" },
  ]);
  useEffect(() => {
    const filled = rows.filter((r) => r.what.trim()).length;
    const whys = rows.filter((r) => r.why.trim()).length;
    onProgress(clamp01((filled * 2 + whys) / 9));
  }, [rows, onProgress]);

  return (
    <div className="space-y-3 py-2">
      {rows.map((r, i) => (
        <div key={i} className="inset-screen p-3.5">
          <p className="mono-label mb-2">
            <span className="text-coral">good thing #{i + 1}</span>
          </p>
          <input
            value={r.what}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, what: e.target.value } : x)))}
            placeholder="anything remotely good — the bar is on the floor"
            className="w-full bg-transparent text-ink text-sm outline-none placeholder:text-faint"
          />
          <input
            value={r.why}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))}
            placeholder="why did it happen? (take some credit)"
            className="w-full bg-transparent text-dim text-[13px] outline-none placeholder:text-faint mt-2 border-t border-line/60 pt-2"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- friend reframe ---------------- */

export function CompassionWidget({ onProgress }: WidgetProps) {
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    onProgress(clamp01((s1 ? 1 : 0) / 3 + (s2 ? 1 : 0) / 3 + (msg.trim().length >= 20 ? 1 : 0) / 3));
  }, [s1, s2, msg, onProgress]);

  const stageBtn = (on: boolean, onClick: () => void, label: ReactNode) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
        on ? "bg-rose/10 border-rose/50 text-ink" : "border-line2 text-dim hover:border-rose/40 hover:-translate-y-0.5"
      }`}
    >
      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${on ? "bg-rose border-rose text-pine" : "border-line2"}`}>
        {on && <span className="text-[11px] font-bold">✓</span>}
      </span>
      {label}
    </button>
  );

  return (
    <div className="space-y-3 py-2">
      {stageBtn(s1, () => setS1(!s1), <span><span className="text-rose font-semibold">Mindfulness.</span> Say it plainly: "this is a moment of struggle." Not a catastrophe — a moment.</span>)}
      {stageBtn(s2, () => setS2(!s2), <span><span className="text-rose font-semibold">Common humanity.</span> Someone in your feed, your office, your family tree has stood exactly here. You're not uniquely broken.</span>)}
      <div>
        <p className="mono-label mb-2">
          <span className="text-rose">kindness.</span> text this to your best friend (they're in the same situation):
        </p>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="hey — first of all, that sounds genuinely hard…"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-faint focus:border-rose/50"
        />
      </div>
      {msg.trim().length >= 20 && (
        <div className="pop-in inset-screen p-4 border-rose/30">
          <p className="mono-label mb-2 text-rose">now read it back — addressed to you</p>
          <p className="text-[15px] text-ink leading-relaxed italic">"{msg.trim()}"</p>
          <p className="mono-label mt-3">— you, to you. keep that voice on speed dial.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- reach out ---------------- */

const WHO = ["a friend", "family", "a coworker", "someone I miss", "anyone, really"];
const STARTERS = [
  "hey, been thinking about you. no need to reply — just wanted you to know.",
  "random appreciation text: you make things better just by being around.",
  "hey — rough week on my end and yours came to mind. how are you, actually?",
];

export function ReachoutWidget({ onProgress }: WidgetProps) {
  const [who, setWho] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    onProgress(clamp01((who ? 1 : 0) / 3 + (msg.trim().length >= 10 ? 1 : 0) / 3 + (sent ? 1 : 0) / 3));
  }, [who, msg, sent, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">who came to mind first?</p>
        <div className="flex flex-wrap gap-2">
          {WHO.map((w) => (
            <button
              key={w}
              onClick={() => setWho(w)}
              className={`px-3.5 py-1.5 rounded-full border text-sm transition-all ${
                who === w ? "bg-peach/15 border-peach/60 text-peach" : "border-line2 text-dim hover:border-peach/40 hover:text-ink"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mono-label mb-2">two lines max. starters if you're stuck:</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {STARTERS.map((s, i) => (
            <button key={i} onClick={() => setMsg(s)} className="text-[11px] font-mono text-faint border border-line rounded-full px-3 py-1 hover:text-peach hover:border-peach/40 transition-colors">
              starter {i + 1}
            </button>
          ))}
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          placeholder={`to ${who ?? "them"}…`}
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-faint focus:border-peach/50"
        />
      </div>
      <button
        onClick={() => setSent(!sent)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all ${
          sent ? "bg-peach/10 border-peach/50 text-ink" : "border-line2 text-dim hover:border-peach/40"
        }`}
      >
        <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${sent ? "bg-peach border-peach text-pine" : "border-line2"}`}>
          {sent && <span className="text-[11px] font-bold">✓</span>}
        </span>
        I actually sent it <span className="mono-label normal-case tracking-normal">(the send is the intervention)</span>
      </button>
    </div>
  );
}

/* ---------------- future self ---------------- */

export function FutureWidget({ onProgress }: WidgetProps) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  useEffect(() => {
    const score = [a, b, c].reduce((n, v) => n + (v.trim().length >= 12 ? 1 : 0), 0);
    onProgress(clamp01(score / 3));
  }, [a, b, c, onProgress]);

  const field = (label: string, val: string, set: (v: string) => void, ph: string) => (
    <div className="inset-screen p-3.5">
      <p className="mono-label mb-2 text-lilac">{label}</p>
      <textarea value={val} onChange={(e) => set(e.target.value)} rows={2} placeholder={ph} className="w-full bg-transparent text-ink text-sm outline-none resize-none placeholder:text-faint" />
    </div>
  );

  return (
    <div className="space-y-3 py-2">
      {field("one year from now, it's behind you.", a, setA, "what does that version of you see when they look back at this week?")}
      {field("what did getting through it build?", b, setB, "patience? proof? a skill? a story?")}
      {field("one tiny thing future-you would do this week", c, setC, "small enough to be almost embarrassing. that's the point.")}
    </div>
  );
}

/* ---------------- dispatcher ---------------- */

export function InterventionWidget({ intervention, onProgress }: WidgetProps) {
  switch (intervention.widget) {
    case "breath":
      return <BreathWidget intervention={intervention} onProgress={onProgress} />;
    case "checklist":
      return <ChecklistWidget intervention={intervention} onProgress={onProgress} />;
    case "label":
      return <LabelWidget intervention={intervention} onProgress={onProgress} />;
    case "control":
      return <ControlWidget intervention={intervention} onProgress={onProgress} />;
    case "gratitude":
      return <GratitudeWidget intervention={intervention} onProgress={onProgress} />;
    case "compassion":
      return <CompassionWidget intervention={intervention} onProgress={onProgress} />;
    case "reachout":
      return <ReachoutWidget intervention={intervention} onProgress={onProgress} />;
    case "future":
      return <FutureWidget intervention={intervention} onProgress={onProgress} />;
  }
}
