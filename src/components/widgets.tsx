import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Intervention } from "../data";

interface WidgetProps {
  intervention: Intervention;
  onProgress: (p: number) => void;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* ---------------- breathing pacer (physiological sigh) ---------------- */

const PHASES = [
  { label: "inhale through the nose", dur: 2.4, scale: 1.14 },
  { label: "sip a little more", dur: 1.1, scale: 1.28 },
  { label: "long exhale — mouth", dur: 5.2, scale: 1.0 },
];
const TARGET_ROUNDS = 3;

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
        if (next >= TARGET_ROUNDS) { setRunning(false); setDone(true); return; }
        setRound(next);
      }
      setPhase((phase + 1) % PHASES.length);
    }, p.dur * 1000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [running, phase, round]);

  const p = PHASES[phase];
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <span className="pulse-ring absolute inset-0 rounded-full border border-sage/30" />
        <div
          className="w-28 h-28 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #7a9e7ecc, #7a9e7e55 55%, #7a9e7e1a)",
            boxShadow: "0 0 40px #7a9e7e30, inset 0 -8px 20px rgba(0,0,0,0.08)",
            transform: `scale(${running || round > 0 || done ? p.scale : 1})`,
            transition: `transform ${p.dur}s cubic-bezier(0.45, 0, 0.35, 1)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-body font-medium text-ink text-sm px-4">{done ? "well done" : running ? p.label : "ready when you are"}</span>
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
            skip
          </button>
        )}
        {done && <p className="font-mono text-sage text-sm">✓ nervous system: notified</p>}
      </div>
    </div>
  );
}

/* ---------------- generic checklist ---------------- */

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
                      ? "bg-sage/10 border-sage/50 text-sage"
                      : "border-border text-ink-light hover:border-sage/40 hover:text-ink"
                  }`}
                >
                  {on ? "✓ " : ""}{item}
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
  ["anxious", "#8fb8d4"], ["overwhelmed", "#7a9e7e"], ["sad", "#8fb8d4"], ["angry", "#e8a87c"],
  ["ashamed", "#d4a5a5"], ["lonely", "#b8a5d4"], ["numb", "#8a7ab8"], ["exhausted", "#d4b896"],
  ["guilty", "#d4a5a5"], ["scared", "#8fb8d4"], ["resentful", "#e8a87c"], ["empty", "#8a7ab8"],
  ["embarrassed", "#d4a5a5"], ["worried", "#8fb8d4"], ["frustrated", "#e8a87c"], ["drained", "#d4b896"],
  ["left out", "#b8a5d4"], ["dreading", "#8fb8d4"], ["inadequate", "#d4a5a5"], ["flat", "#8a7ab8"],
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
                className="px-3.5 py-1.5 rounded-full border text-sm transition-all duration-200"
                style={
                  on
                    ? { background: `${color}18`, borderColor: `${color}66`, color }
                    : { borderColor: "#e8e4df", color: "#4a4a4a" }
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
            how loud is it? <span className="text-sky font-mono normal-case tracking-normal">{intensity}/10</span>
          </p>
          <input type="range" min={1} max={10} value={intensity} onChange={(e) => setIntensity(+e.target.value)} className="mood" />
        </div>
      )}
      <div>
        <p className="mono-label mb-2">finish the sentence — one line is plenty</p>
        <div className="inset-screen p-4">
          <p className="text-sm text-ink-light mb-2 font-mono">
            right now I feel <span className="text-sky">{picked.length ? picked.join(" + ") : "…"}</span>
          </p>
          <textarea
            value={because}
            onChange={(e) => setBecause(e.target.value)}
            rows={2}
            placeholder="because…"
            className="w-full bg-transparent border-b border-border focus:border-sky outline-none text-ink text-sm resize-none placeholder:text-ink-muted transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- body scan ---------------- */

const BODY_AREAS = ["head", "shoulders", "chest", "stomach", "arms", "legs", "feet"];
const SENSATIONS = ["tight", "warm", "heavy", "buzzing", "numb", "neutral"];

export function BodyScanWidget({ onProgress }: WidgetProps) {
  const [area, setArea] = useState(0);
  const [sensation, setSensation] = useState<string | null>(null);
  const [breaths, setBreaths] = useState(0);

  useEffect(() => {
    const p = (area / BODY_AREAS.length) * 0.7 + (sensation ? 0.2 : 0) + (breaths >= 3 ? 0.1 : 0);
    onProgress(clamp01(p));
  }, [area, sensation, breaths, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">scan area {area + 1} of {BODY_AREAS.length}: <span className="text-ink normal-case tracking-normal">{BODY_AREAS[area]}</span></p>
        <p className="text-sm text-ink-light mb-3">what do you notice? tight, warm, heavy, buzzing, numb, or neutral?</p>
        <div className="flex flex-wrap gap-2">
          {SENSATIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSensation(s)}
              className={`px-3.5 py-1.5 rounded-full border text-sm transition-all ${
                sensation === s
                  ? "bg-sage/10 border-sage/50 text-sage"
                  : "border-border text-ink-light hover:border-sage/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {sensation && (
        <div className="pop-in space-y-3">
          <p className="mono-label">stay with it for 3 breaths</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((b) => (
              <button
                key={b}
                onClick={() => setBreaths(b)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono transition-all ${
                  breaths >= b ? "bg-sage/10 border-sage/50 text-sage" : "border-border text-ink-muted"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          {area < BODY_AREAS.length - 1 && breaths >= 3 && (
            <button onClick={() => { setArea(area + 1); setSensation(null); setBreaths(0); }} className="btn-ghost px-5 py-2 text-sm">
              next area →
            </button>
          )}
          {area === BODY_AREAS.length - 1 && breaths >= 3 && (
            <p className="font-mono text-sage text-sm">✓ scan complete</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- gratitude (three good things) ---------------- */

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
            <span className="text-peach">good thing #{i + 1}</span>
          </p>
          <input
            value={r.what}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, what: e.target.value } : x)))}
            placeholder="anything remotely good — the bar is on the floor"
            className="w-full bg-transparent text-ink text-sm outline-none placeholder:text-ink-muted"
          />
          <input
            value={r.why}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))}
            placeholder="why did it happen? (take some credit)"
            className="w-full bg-transparent text-ink-light text-[13px] outline-none placeholder:text-ink-muted mt-2 border-t border-border pt-2"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- savor the small thing ---------------- */

export function SavorWidget({ onProgress }: WidgetProps) {
  const [thing, setThing] = useState("");
  const [timer, setTimer] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!thing.trim()) { onProgress(0); return; }
    onProgress(clamp01(timer / 60 + (done ? 0.2 : 0)));
  }, [thing, timer, done, onProgress]);

  useEffect(() => {
    if (!thing.trim() || done) return;
    const interval = setInterval(() => setTimer((t) => Math.min(t + 1, 60)), 1000);
    return () => clearInterval(interval);
  }, [thing, done]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">pick one small pleasant thing available right now</p>
        <input
          value={thing}
          onChange={(e) => setThing(e.target.value)}
          placeholder="e.g. this cup of tea, the sunlight, a song playing…"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none placeholder:text-ink-muted"
        />
      </div>
      {thing.trim() && !done && (
        <div className="pop-in text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div
              className="absolute inset-0 rounded-full border-4 border-sage"
              style={{ clipPath: `polygon(50% 50%, 50% 0%, ${timer >= 15 ? "100% 0%" : "50% 0%"} ${timer >= 15 ? (timer >= 30 ? "100% 100%" : `${50 + (timer - 15) / 15 * 50}% 100%`) : "50% 0%"})` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl text-ink">{60 - timer}s</span>
            </div>
          </div>
          <p className="text-sm text-ink-light">give it your full attention. if your mind wanders, gently return.</p>
          {timer >= 60 && (
            <button onClick={() => setDone(true)} className="btn-main px-6 py-2.5 text-sm mt-4">
              that was good ✓
            </button>
          )}
        </div>
      )}
      {done && <p className="font-mono text-sage text-sm text-center">✓ you just stretched one small good moment</p>}
    </div>
  );
}

/* ---------------- one small win ---------------- */

export function SmallWinWidget({ onProgress }: WidgetProps) {
  const [task, setTask] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    onProgress(clamp01((task.trim() ? 0.5 : 0) + (done ? 0.5 : 0)));
  }, [task, done, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">what is one tiny thing you can complete in the next 2 minutes?</p>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. make the bed, reply to one message, wash one dish…"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none placeholder:text-ink-muted"
          disabled={done}
        />
      </div>
      {task.trim() && !done && (
        <div className="pop-in text-center">
          <p className="text-sm text-ink-light mb-4">do that one thing — fully, right now. then come back.</p>
          <button onClick={() => setDone(true)} className="btn-main px-6 py-2.5 text-sm">
            i did it ✓
          </button>
        </div>
      )}
      {done && (
        <div className="pop-in inset-screen p-5 text-center">
          <p className="font-display text-xl text-ink mb-2">"I did that. I made something happen."</p>
          <p className="font-mono text-sage text-sm">✓ competence signal: received</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- best possible self ---------------- */

export function BestSelfWidget({ onProgress }: WidgetProps) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  useEffect(() => {
    const score = [a, b, c].reduce((n, v) => n + (v.trim().length >= 12 ? 1 : 0), 0);
    onProgress(clamp01(score / 3));
  }, [a, b, c, onProgress]);

  const field = (label: string, val: string, set: (v: string) => void, ph: string) => (
    <div className="inset-screen p-3.5">
      <p className="mono-label mb-2 text-amber">{label}</p>
      <textarea value={val} onChange={(e) => set(e.target.value)} rows={2} placeholder={ph} className="w-full bg-transparent text-ink text-sm outline-none resize-none placeholder:text-ink-muted" />
    </div>
  );

  return (
    <div className="space-y-3 py-2">
      {field("one week from now, you handled it well.", a, setA, "what did that version of you do? how did it feel?")}
      {field("one action you could take in the next 24 hours", b, setB, "small enough to be almost embarrassing. that's the point.")}
      {field("commit to it", c, setC, "when + where. e.g. 'tomorrow, 9am, at my desk'")}
    </div>
  );
}

/* ---------------- self-compassionate note ---------------- */

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
        on ? "bg-rose/8 border-rose/40 text-ink" : "border-border text-ink-light hover:border-rose/30"
      }`}
    >
      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${on ? "bg-rose border-rose text-white" : "border-border"}`}>
        {on && <span className="text-[11px] font-bold">✓</span>}
      </span>
      {label}
    </button>
  );

  return (
    <div className="space-y-3 py-2">
      {stageBtn(s1, () => setS1(!s1), <span><span className="text-rose font-medium">Mindfulness.</span> Say it plainly: "this is a moment of struggle."</span>)}
      {stageBtn(s2, () => setS2(!s2), <span><span className="text-rose font-medium">Common humanity.</span> Someone in your life has stood exactly here. You're not uniquely broken.</span>)}
      <div>
        <p className="mono-label mb-2">
          <span className="text-rose">kindness.</span> what would you say to a close friend in this exact situation?
        </p>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="hey — first of all, that sounds genuinely hard…"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-ink-muted"
        />
      </div>
      {msg.trim().length >= 20 && (
        <div className="pop-in inset-screen p-4 border-rose/20">
          <p className="mono-label mb-2 text-rose">now read it back — addressed to you</p>
          <p className="text-[15px] text-ink leading-relaxed italic">"{msg.trim()}"</p>
          <p className="mono-label mt-3">— you, to you. keep that voice on speed dial.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- common humanity reset ---------------- */

export function HumanityWidget({ onProgress }: WidgetProps) {
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);

  useEffect(() => {
    onProgress(clamp01((s1 ? 1 : 0) / 3 + (s2 ? 1 : 0) / 3 + (s3 ? 1 : 0) / 3));
  }, [s1, s2, s3, onProgress]);

  const stageBtn = (on: boolean, onClick: () => void, label: ReactNode) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
        on ? "bg-lavender/8 border-lavender/40 text-ink" : "border-border text-ink-light hover:border-lavender/30"
      }`}
    >
      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${on ? "bg-lavender border-lavender text-white" : "border-border"}`}>
        {on && <span className="text-[11px] font-bold">✓</span>}
      </span>
      {label}
    </button>
  );

  return (
    <div className="space-y-3 py-2">
      {stageBtn(s1, () => setS1(!s1), "Think of what you're struggling with right now.")}
      {stageBtn(s2, () => setS2(!s2), <span>Say: <span className="text-lavender font-medium">"This is a moment of struggle. Struggle is part of being human."</span></span>)}
      {stageBtn(s3, () => setS3(!s3), "Take one slow breath. You are not alone in this experience.")}
      {s3 && <p className="font-mono text-lavender text-sm text-center pt-2">✓ you're not uniquely broken. you're human.</p>}
    </div>
  );
}

/* ---------------- loving-kindness micro ---------------- */

export function LovingKindnessWidget({ onProgress }: WidgetProps) {
  const [person, setPerson] = useState("");
  const [phrases, setPhrases] = useState(0);
  const [self, setSelf] = useState(false);

  useEffect(() => {
    onProgress(clamp01((person.trim() ? 0.2 : 0) + phrases / 3 * 0.5 + (self ? 0.3 : 0)));
  }, [person, phrases, self, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">bring to mind someone you care about</p>
        <input
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="a friend, family member, pet…"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none placeholder:text-ink-muted"
        />
      </div>
      {person.trim() && (
        <div className="pop-in space-y-2">
          <p className="mono-label mb-2">silently repeat these phrases for {person}:</p>
          {["May you be safe.", "May you be well.", "May you be happy."].map((phrase, i) => (
            <button
              key={i}
              onClick={() => setPhrases(i + 1)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                phrases > i ? "bg-lavender/8 border-lavender/40 text-ink" : "border-border text-ink-light hover:border-lavender/30"
              }`}
            >
              {phrase}
            </button>
          ))}
        </div>
      )}
      {phrases >= 3 && (
        <div className="pop-in">
          <button
            onClick={() => setSelf(!self)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
              self ? "bg-lavender/8 border-lavender/40 text-ink" : "border-border text-ink-light hover:border-lavender/30"
            }`}
          >
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${self ? "bg-lavender border-lavender text-white" : "border-border"}`}>
              {self && <span className="text-[11px] font-bold">✓</span>}
            </span>
            extend the same wish to yourself
          </button>
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
                who === w ? "bg-lavender/10 border-lavender/50 text-lavender" : "border-border text-ink-light hover:border-lavender/40"
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
            <button key={i} onClick={() => setMsg(s)} className="text-[11px] font-mono text-ink-muted border border-border rounded-full px-3 py-1 hover:text-lavender hover:border-lavender/40 transition-colors">
              starter {i + 1}
            </button>
          ))}
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          placeholder={`to ${who ?? "them"}…`}
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-ink-muted"
        />
      </div>
      <button
        onClick={() => setSent(!sent)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all ${
          sent ? "bg-lavender/8 border-lavender/40 text-ink" : "border-border text-ink-light hover:border-lavender/30"
        }`}
      >
        <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${sent ? "bg-lavender border-lavender text-white" : "border-border"}`}>
          {sent && <span className="text-[11px] font-bold">✓</span>}
        </span>
        I actually sent it <span className="mono-label normal-case tracking-normal">(the send is the intervention)</span>
      </button>
    </div>
  );
}

/* ---------------- silver lining ---------------- */

export function SilverLiningWidget({ onProgress }: WidgetProps) {
  const [stressor, setStressor] = useState("");
  const [benefit, setBenefit] = useState("");

  useEffect(() => {
    onProgress(clamp01((stressor.trim() ? 0.4 : 0) + (benefit.trim() ? 0.6 : 0)));
  }, [stressor, benefit, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">think of the current stressor or recent difficulty</p>
        <textarea
          value={stressor}
          onChange={(e) => setStressor(e.target.value)}
          rows={2}
          placeholder="what's been weighing on you?"
          className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-ink-muted"
        />
      </div>
      {stressor.trim() && (
        <div className="pop-in">
          <p className="mono-label mb-2">has anything come out of this that you wouldn't trade?</p>
          <textarea
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            rows={2}
            placeholder="Even though this is hard, one thing that has come from it is…"
            className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none resize-none placeholder:text-ink-muted"
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- values compass ---------------- */

const VALUES = ["kind", "honest", "brave", "patient", "curious", "present", "strong", "gentle"];

export function ValuesWidget({ onProgress }: WidgetProps) {
  const [value, setValue] = useState<string | null>(null);
  const [action, setAction] = useState("");

  useEffect(() => {
    onProgress(clamp01((value ? 0.4 : 0) + (action.trim() ? 0.6 : 0)));
  }, [value, action, onProgress]);

  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="mono-label mb-2">in this moment, what kind of person do you want to be?</p>
        <div className="flex flex-wrap gap-2">
          {VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setValue(v)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                value === v ? "bg-amber/10 border-amber/50 text-amber" : "border-border text-ink-light hover:border-amber/40"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {value && (
        <div className="pop-in">
          <p className="mono-label mb-2">what is one tiny action you could take in the next hour that would be you living <span className="text-amber">{value}</span>?</p>
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g. send a kind text, be honest about how I feel, take 5 minutes to be present…"
            className="w-full inset-screen p-4 bg-transparent text-ink text-sm outline-none placeholder:text-ink-muted"
          />
        </div>
      )}
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
    case "bodyscan":
      return <BodyScanWidget intervention={intervention} onProgress={onProgress} />;
    case "gratitude":
      return <GratitudeWidget intervention={intervention} onProgress={onProgress} />;
    case "savor":
      return <SavorWidget intervention={intervention} onProgress={onProgress} />;
    case "smallwin":
      return <SmallWinWidget intervention={intervention} onProgress={onProgress} />;
    case "bestself":
      return <BestSelfWidget intervention={intervention} onProgress={onProgress} />;
    case "compassion":
      return <CompassionWidget intervention={intervention} onProgress={onProgress} />;
    case "humanity":
      return <HumanityWidget intervention={intervention} onProgress={onProgress} />;
    case "lovingkindness":
      return <LovingKindnessWidget intervention={intervention} onProgress={onProgress} />;
    case "reachout":
      return <ReachoutWidget intervention={intervention} onProgress={onProgress} />;
    case "silverlining":
      return <SilverLiningWidget intervention={intervention} onProgress={onProgress} />;
    case "values":
      return <ValuesWidget intervention={intervention} onProgress={onProgress} />;
  }
}
