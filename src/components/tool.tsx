import { useEffect, useMemo, useRef, useState } from "react";
import {
  interventionById,
  MECHANISMS,
  MECHANISM_ORDER,
  QUICK_CHIPS,
  type Intervention,
  type MechanismId,
  type SessionEntry,
} from "../data";
import { infer, pickIntervention, type Inference } from "../engine";
import { BreathOrb } from "./orb";
import { InterventionWidget } from "./widgets";
import { MechTag, Arrow, Spark } from "./chrome";

export interface Launch {
  id: string;
  ts: number;
}

type Stage = "input" | "analyzing" | "session" | "done";

const ANALYSIS_LINES = [
  "reading the situation…",
  "scanning emotion language…",
  "checking what you've already tried…",
  "applying sequence rule — safety → clarity → growth",
  "matching mechanism → intervention",
];

const zeroScores = () =>
  Object.fromEntries(MECHANISM_ORDER.map((m) => [m, 0])) as Record<MechanismId, number>;

function syntheticInference(iv: Intervention): Inference {
  const m = MECHANISMS[iv.mechanism];
  return {
    situation: "library pick — no inference needed",
    emotions: [],
    triedHealthy: [],
    triedUnhealthy: [],
    scores: zeroScores(),
    mechanism: iv.mechanism,
    alt: null,
    gateNote: "you named the need yourself. autonomy is therapeutic too.",
    headline: `You picked the ${m.label} route.`,
    message: `No guessing needed — you went straight for "${m.need}". The ${iv.minutes} minutes are yours.`,
    arousal: 0.1,
    interventionId: iv.id,
  };
}

/* ---------------- readout panel ---------------- */

function ScoreBars({ scores, max = 4 }: { scores: Record<MechanismId, number>; max?: number }) {
  const rows = MECHANISM_ORDER.filter((m) => scores[m] > 0);
  if (rows.length === 0) return <p className="font-mono text-[11px] text-taupe">no dominant pattern — routing to clarity</p>;
  return (
    <div className="space-y-1.5 mt-2">
      {rows.map((m, i) => (
        <div key={m} className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider w-[92px] shrink-0" style={{ color: MECHANISMS[m].color }}>
            {MECHANISMS[m].label}
          </span>
          <span className="flex-1 h-[4px] rounded-full bg-border overflow-hidden">
            <span
              className="width-grow block h-full rounded-full"
              style={{ width: `${Math.min(100, (scores[m] / max) * 100)}%`, background: MECHANISMS[m].color, animationDelay: `${i * 90}ms` }}
            />
          </span>
          <span className="font-mono text-[10px] text-taupe w-4 text-right">{scores[m]}</span>
        </div>
      ))}
    </div>
  );
}

function ReadoutLine({ k, v, vColor = "#1A1918" }: { k: string; v: string; vColor?: string }) {
  return (
    <p className="font-mono text-[11.5px] leading-relaxed text-espresso">
      <span className="text-taupe">{k}</span> <span style={{ color: vColor }}>{v}</span>
    </p>
  );
}

interface PanelProps {
  stage: Stage;
  preview: Inference | null;
  inference: Inference | null;
  intervention: Intervention | null;
  analysisStage: number;
  delta: number | null;
}

function ReadoutPanel({ stage, preview, inference, intervention, analysisStage, delta }: PanelProps) {
  const live = stage === "input" && preview;
  const inf = stage === "session" || stage === "done" ? inference : live ? preview : null;

  const orbColor =
    stage === "done" ? "#B8D4C8"
    : stage === "session" && inference ? MECHANISMS[inference.mechanism].color
    : live && preview ? (preview.arousal > 0.45 ? "#E8C4B8" : preview.arousal > 0.2 ? "#E8D4B8" : "#B8D4C8")
    : "#B8D4C8";
  const orbSpeed = live && preview ? (preview.arousal > 0.45 ? 3.4 : preview.arousal > 0.2 ? 5.5 : 8) : 7.5;
  const orbLabel =
    stage === "done" ? "settled"
    : stage === "analyzing" ? "decoding"
    : stage === "session" && inference ? MECHANISMS[inference.mechanism].need
    : live ? "listening" : "at rest";

  return (
    <div className="panel p-7 flex flex-col items-center gap-5">
      <BreathOrb color={orbColor} speed={orbSpeed} size={180} label={orbLabel} sub={stage === "analyzing" ? "hold on" : "breathing with you"} />
      <div className="inset-screen w-full p-5 min-h-[180px]">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-label">inference readout</span>
          <span className={`w-1.5 h-1.5 rounded-full ${stage === "analyzing" ? "bg-terracotta" : "bg-sage"} ${stage !== "done" ? "animate-pulse" : ""}`} />
        </div>

        {stage === "input" && !live && (
          <div className="font-mono text-[11.5px] leading-[2] text-taupe">
            <p className="text-taupe">▸ system idle — awaiting input</p>
            <p className="text-taupe">three signals feed the match:</p>
            <p><span className="text-sage">01</span> the situation you describe</p>
            <p><span className="text-[#8BA7B8]">02</span> the emotion language you use</p>
            <p><span className="text-terracotta">03</span> what you've already tried</p>
            <p className="text-taupe">sequence: safety → clarity → growth</p>
            <p className="text-sage">type anything — messy is welcome<span className="caret">▊</span></p>
          </div>
        )}

        {live && preview && (
          <div>
            <ReadoutLine k="situation:" v={preview.situation} />
            {preview.emotions.length > 0 ? (
              preview.emotions.map((e) => (
                <ReadoutLine key={e.label} k="emotion:" v={`${e.label} — "${e.words.slice(0, 3).join(", ")}"`} />
              ))
            ) : (
              <ReadoutLine k="emotion:" v="scanning…" />
            )}
            {preview.triedUnhealthy.length > 0 && (
              <ReadoutLine k="coping:" v={`↻ ${preview.triedUnhealthy[0]} — we replace, not preach`} />
            )}
            {preview.triedHealthy.length > 0 && (
              <ReadoutLine k="coping:" v="✓ you've already tried something — building on it" />
            )}
            <ReadoutLine k="leading:" v={MECHANISMS[preview.mechanism].label} />
            {preview.gateNote && <ReadoutLine k="rule:" v={preview.gateNote} />}
            <ScoreBars scores={preview.scores} />
            <p className="font-mono text-[11px] text-sage mt-2">▸ live preview — hit decode to commit<span className="caret">▊</span></p>
          </div>
        )}

        {stage === "analyzing" && (
          <div className="font-mono text-[11.5px] leading-[2] text-taupe">
            {ANALYSIS_LINES.slice(0, analysisStage + 1).map((l, i) => (
              <p key={l} className={i === analysisStage ? "text-espresso" : "text-taupe"}>
                <span className="text-sage">▸</span> {l}
                {i === analysisStage && <span className="caret">▊</span>}
              </p>
            ))}
          </div>
        )}

        {stage === "session" && inference && intervention && (
          <div className="pop-in">
            <ReadoutLine k="situation:" v={inference.situation} />
            {inference.emotions.slice(0, 2).map((e) => (
              <ReadoutLine key={e.label} k="emotion:" v={e.label} />
            ))}
            {inference.triedUnhealthy.length > 0 && (
              <ReadoutLine k="coping:" v={`replacing: ${inference.triedUnhealthy.slice(0, 2).join(", ")}`} />
            )}
            <ReadoutLine k="mechanism:" v={MECHANISMS[inference.mechanism].label} />
            <ReadoutLine k="delivered:" v={`${intervention.title} · ${intervention.minutes} min`} />
            <ScoreBars scores={inference.scores} />
          </div>
        )}

        {stage === "done" && inference && (
          <div className="pop-in font-mono text-[11.5px] leading-[2]">
            <p className="text-espresso">✓ session logged</p>
            <ReadoutLine k="mechanism:" v={MECHANISMS[inference.mechanism].label} />
            {delta !== null && (
              <ReadoutLine k="heaviness:" v={`${delta <= 0 ? `${delta}` : `+${delta}`} — ${delta <= 0 ? "lighter. that's the whole game." : "rough round. it still counts."}`} />
            )}
            <p className="text-taupe">the tool did its job: you felt enough to act.</p>
          </div>
        )}
      </div>
      <p className="text-center text-[11px] font-mono text-taupe -mt-1">
        this panel is the transparency layer — same signals a clinician would screen for
      </p>
    </div>
  );
}

/* ---------------- mood check ---------------- */

function MoodCheck({
  label,
  value,
  onChange,
  onConfirm,
  confirmed,
  confirmLabel,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  onConfirm?: () => void;
  confirmed?: boolean;
  confirmLabel?: string;
}) {
  return (
    <div className={`panel p-6 transition-opacity ${confirmed ? "opacity-70" : ""}`}>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <p className="mono-label">{label}</p>
        <p className="font-display text-3xl text-espresso tabular-nums">
          {value}<span className="text-taupe text-base font-body font-normal"> /10</span>
        </p>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={(e) => onChange(+e.target.value)} className="mood" disabled={confirmed} />
      <div className="flex justify-between mono-label mt-1.5 normal-case tracking-normal text-[10px]">
        <span>barely there</span>
        <span>crushing</span>
      </div>
      {onConfirm && !confirmed && (
        <button onClick={onConfirm} className="btn-ghost px-5 py-2 text-sm font-mono mt-3">
          {confirmLabel ?? "lock it in"}
        </button>
      )}
    </div>
  );
}

/* ---------------- the tool ---------------- */

export function Tool({ onLogged, launch, onStageChange }: { onLogged: (e: SessionEntry) => void; launch: Launch | null; onStageChange?: (stage: Stage) => void }) {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [inference, setInference] = useState<Inference | null>(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [manual, setManual] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [stepsDone, setStepsDone] = useState<boolean[]>([]);
  const [progress, setProgress] = useState(0);
  const [moodBeforeVal, setMoodBeforeVal] = useState(6);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfterVal, setMoodAfterVal] = useState(5);
  const [doneDelta, setDoneDelta] = useState<number | null>(null);
  const loggedRef = useRef(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const preview = useMemo(() => (text.trim().length >= 4 ? infer(text) : null), [text]);

  useEffect(() => {
    if (stage !== "analyzing") return;
    if (analysisStage >= ANALYSIS_LINES.length) {
      setStage("session");
      return;
    }
    const t = setTimeout(() => setAnalysisStage((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [stage, analysisStage]);

  useEffect(() => {
    if (onStageChange) onStageChange(stage);
  }, [stage, onStageChange]);

  useEffect(() => {
    if (!launch) return;
    const iv = interventionById(launch.id);
    setInference(syntheticInference(iv));
    setIntervention(iv);
    setManual(true);
    setStage("session");
    setProgress(0);
    setStepsDone(new Array(iv.steps.length).fill(false));
    setMoodBefore(null);
    setMoodBeforeVal(6);
    setMoodAfterVal(5);
    setDoneDelta(null);
    loggedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [launch]);

  useEffect(() => {
    if (intervention && stage === "session") {
      setStepsDone(new Array(intervention.steps.length).fill(false));
      setProgress(0);
    }
  }, [intervention?.id, stage]);

  const submit = () => {
    if (text.trim().length < 8) return;
    const inf = infer(text);
    setInference(inf);
    setIntervention(interventionById(inf.interventionId));
    setManual(false);
    setAnalysisStage(0);
    setStage("analyzing");
    setMoodBefore(null);
    setMoodBeforeVal(6);
    setMoodAfterVal(5);
    setDoneDelta(null);
    loggedRef.current = false;
  };

  const restart = () => {
    setStage("input");
    setText("");
    setInference(null);
    setIntervention(null);
    setDoneDelta(null);
    loggedRef.current = false;
    setTimeout(() => taRef.current?.focus(), 60);
  };

  const swapTo = (mech: MechanismId) => {
    const id = pickIntervention(mech, text);
    setIntervention(interventionById(id));
    setMoodBefore(null);
    loggedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const complete = () => {
    if (!inference || !intervention || loggedRef.current) return;
    const before = moodBefore ?? moodBeforeVal;
    const after = moodAfterVal;
    loggedRef.current = true;
    onLogged({
      id: `${Date.now()}`,
      ts: Date.now(),
      mechanism: inference.mechanism,
      interventionId: intervention.id,
      snippet: manual ? "(library pick)" : text.trim().slice(0, 90),
      before,
      after,
      manual,
    });
    setDoneDelta(after - before);
    setStage("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeReady = progress >= 0.99;

  return (
    <section id="tool" className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
        {/* ---------- left column ---------- */}
        <div className="lg:col-span-7">
          {stage === "input" && (
            <div className="pop-in">
              <h1 className="font-display text-espresso mt-5 leading-[1.05] text-[clamp(2.5rem,6vw,4.2rem)]">
                what's weighing<br />on you <em className="italic text-taupe">right now?</em>
              </h1>
              <p className="text-taupe text-[15px] sm:text-base leading-relaxed mt-5 max-w-xl">
                Type out whatever is stressing you out right now. Be it messy, vague, or unfiltered. 
                We'll identify what your brain actually needs and give you a quick step to handle it.
              </p>

              <div className="panel p-2 mt-10 focus-within:border-taupe transition-colors">
                <textarea
                  ref={taRef}
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 600))}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
                  }}
                  rows={4}
                  placeholder="type it messy. 'idk everything is a lot' absolutely counts."
                  className="w-full bg-transparent px-4 py-3 text-espresso text-[15px] leading-relaxed resize-none outline-none placeholder:text-taupe min-h-[110px]"
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <span className="font-mono text-[11px] text-taupe">{text.length}/600 · ⌘↵ to decode</span>
                  <button onClick={submit} disabled={text.trim().length < 8} className="btn-main px-6 py-2.5 text-[15px] flex items-center gap-2">
                    decode it <Arrow className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="mono-label mb-3">or start from somewhere familiar:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => {
                        setText(c.text);
                        taRef.current?.focus();
                      }}
                      className="btn-ghost px-4 py-2 text-sm hover:text-espresso transition-colors"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="font-mono text-[11px] text-taupe mt-8 leading-relaxed">
                if this is a crisis and not a bad day —{" "}
                <a href="tel:9152987821" className="underline hover:text-espresso transition-colors">iCall: 9152987821</a> or{" "}
                <a href="tel:18602662345" className="underline hover:text-espresso transition-colors">Vandrevala: 1860-2662-345</a>.
                this is a momentary lever, not a lifeline.
              </p>
            </div>
          )}

          {(stage === "analyzing" || stage === "session") && inference && intervention && (
            <div className="pop-in" key={intervention.id}>
              <div className="flex items-center justify-between gap-4">
                <p className="mono-label truncate">
                  you said: <span className="text-taupe normal-case tracking-normal">"{manual ? "picked from library" : text.trim().slice(0, 72)}{!manual && text.trim().length > 72 ? "…" : ""}"</span>
                </p>
                <button onClick={restart} className="btn-ghost px-4 py-1.5 text-[12px] font-mono shrink-0">
                  start over
                </button>
              </div>

              <div className="mt-7">
                <h2 className="font-display text-espresso leading-tight text-3xl sm:text-4xl tracking-tight">{inference.headline}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <MechTag id={inference.mechanism} />
                  <span className="font-mono text-[11px] text-taupe">{MECHANISMS[inference.mechanism].need}</span>
                </div>
              </div>

              {inference.gateNote && (
                <p className="font-mono text-[11px] text-espresso mt-3 bg-[#E8D4B8]/30 px-3 py-1.5 rounded-md inline-block">▸ {inference.gateNote}</p>
              )}
              <p className="text-taupe text-[15px] leading-relaxed mt-4 max-w-xl">{inference.message}</p>

              <div className="mt-8">
                <MoodCheck
                  label="before — how heavy is it right now?"
                  value={moodBeforeVal}
                  onChange={setMoodBeforeVal}
                  onConfirm={() => setMoodBefore(moodBeforeVal)}
                  confirmed={moodBefore !== null}
                  confirmLabel={`locked at ${moodBeforeVal} — let's go`}
                />
              </div>

              {/* intervention card */}
              <div className="panel mt-6 overflow-hidden">
                <div className="px-7 pt-7 pb-6 border-b border-border flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="mono-label mb-1.5" style={{ color: MECHANISMS[intervention.mechanism].color }}>
                      your micro-intervention · restores {MECHANISMS[intervention.mechanism].need}
                    </p>
                    <h3 className="font-display text-espresso text-2xl tracking-tight">{intervention.title}</h3>
                    <p className="font-mono text-[11px] text-taupe mt-1.5 leading-relaxed max-w-md">
                      evidence: {intervention.evidence}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-taupe border border-border rounded-full px-3 py-1.5 shrink-0">
                    ~{intervention.minutes} min
                  </span>
                </div>

                <div className="px-7 py-6">
                  <p className="mono-label mb-2">why this one works</p>
                  <p className="text-taupe text-sm leading-relaxed max-w-xl">{intervention.why}</p>
                </div>

                <div className="px-7 pb-6">
                  <p className="mono-label mb-3">the steps — tap each as you go</p>
                  <ol className="space-y-2">
                    {intervention.steps.map((s, i) => {
                      const done = stepsDone[i];
                      return (
                        <li key={i}>
                          <button
                            onClick={() => setStepsDone(stepsDone.map((v, j) => (j === i ? !v : v)))}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                              done ? "border-border bg-linen" : "border-border bg-cream hover:-translate-y-0.5"
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                done ? "bg-sage border-sage text-linen" : "border-border text-taupe"
                              }`}
                            >
                              {done ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3.5 h-3.5">
                                  <path d="M4 12.5l5 5L20 6.5" className="draw-check" />
                                </svg>
                              ) : (
                                <span className="font-mono text-[11px]">{i + 1}</span>
                              )}
                            </span>
                            <span className={`text-sm leading-relaxed transition-colors ${done ? "text-taupe line-through decoration-sage/30" : "text-espresso"}`}>
                              {s}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="px-7 pb-7">
                  <p className="mono-label mb-1">do it — the interactive bit</p>
                  <InterventionWidget intervention={intervention} onProgress={setProgress} />
                </div>

                {/* progress + finish */}
                <div className="px-7 pb-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress * 100}%`, background: MECHANISMS[intervention.mechanism].color }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-taupe">{Math.round(progress * 100)}%</span>
                  </div>

                  {completeReady && (
                    <div className="pop-in space-y-4">
                      <MoodCheck label="after — how heavy is it now?" value={moodAfterVal} onChange={setMoodAfterVal} />
                      <button onClick={complete} className="btn-main px-7 py-3 text-base flex items-center gap-2">
                        log it & close the loop <Spark className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!completeReady && (
                    <p className="font-mono text-[11px] text-taupe">
                      finish the exercise above to unlock the after-check.
                    </p>
                  )}
                </div>
              </div>

              {/* alt + closer */}
              <div className="flex items-center justify-between gap-4 mt-5 flex-wrap">
                <p className="font-mono text-[11px] text-taupe italic max-w-sm">"{intervention.closer}"</p>
                {inference.alt && !manual && (
                  <button
                    onClick={() => swapTo(inference.alt!)}
                    className="btn-ghost px-4 py-2 text-[13px] font-mono flex items-center gap-2"
                  >
                    not the right tool? try <span style={{ color: MECHANISMS[inference.alt].color }}>{MECHANISMS[inference.alt].label}</span> <Arrow className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === "done" && inference && intervention && (
            <div className="pop-in">
              <p className="mono-label">session logged · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <h2 className="font-display text-espresso mt-3 leading-[1.05] text-[clamp(2.2rem,5vw,3.5rem)]">
                unclenched<span className="text-sage">.</span>
              </h2>
              <p className="text-taupe mt-4 max-w-xl text-[15px] leading-relaxed">
                You didn't solve the situation — you restored the mechanism underneath it. That's the whole
                trick: feel better <em className="text-espresso not-italic font-medium">first</em>, then handle it. Because you can.
              </p>

              <div className="panel mt-10 p-7 flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-end gap-6">
                  <DeltaBar label="before" value={moodBefore ?? moodBeforeVal} color="#E8D4B8" />
                  <DeltaBar label="after" value={moodAfterVal} color="#B8D4C8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-display text-5xl tabular-nums text-espresso">
                    {doneDelta !== null && doneDelta <= 0 ? `−${Math.abs(doneDelta)}` : `+${doneDelta}`}
                  </p>
                  <p className="mono-label mt-1">heaviness delta</p>
                  <p className="font-mono text-[12px] text-taupe mt-3 leading-relaxed">
                    mechanism: <span style={{ color: MECHANISMS[inference.mechanism].color }}>{MECHANISMS[inference.mechanism].label}</span> · tool: {intervention.title}
                    <br />
                    "{intervention.closer}"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-7 flex-wrap">
                <button onClick={restart} className="btn-main px-6 py-3 text-[15px] flex items-center gap-2">
                  another round <Arrow className="w-4 h-4" />
                </button>
                <a href="#log" className="btn-ghost px-6 py-3 text-[15px] font-mono flex items-center gap-2">
                  view log ↓
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ---------- right column ---------- */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <ReadoutPanel
              stage={stage}
              preview={preview}
              inference={inference}
              intervention={intervention}
              analysisStage={analysisStage}
              delta={doneDelta}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DeltaBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-32 w-12 rounded-lg bg-cream border border-border flex items-end overflow-hidden">
        <div
          className="w-full rounded-t-md bar-rise"
          style={{ height: `${Math.max(8, value * 10)}%`, background: `${color}cc`, animationDelay: label === "after" ? "250ms" : "0ms" }}
        />
      </div>
      <span className="font-mono text-[11px] text-taupe">
        {label} <span style={{ color }}>{value}</span>
      </span>
    </div>
  );
}
