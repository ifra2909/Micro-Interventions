import { EMOTION_FAMILIES, MECHANISMS, type MechanismId } from "./data";

const LEX: Record<MechanismId, string[]> = {
  safety: [
    "can't breathe", "cant breathe", "heart is racing", "heart racing", "racing heart",
    "chest is tight", "tight chest", "chest tight", "chest feels", "shaking", "trembling",
    "hyperventil", "panic attack", "panicking", "panic", "spiraling", "spiralling", "spiral",
    "freaking out", "freak out", "meltdown", "melting down", "can't sleep", "cant sleep",
    "insomnia", "3am", "3 am", "can't stop crying", "cant stop crying", "crying",
    "drowning", "frozen", "freeze up", "can't think", "cant think", "overwhelmed",
    "overwhelming", "too much", "attack",
  ],
  clarity: [
    "don't know what i feel", "dont know what i feel", "don't know what i'm feeling",
    "don't know what im feeling", "dont know what", "don't know how i feel",
    "can't explain", "cant explain", "can't pinpoint", "cant pinpoint", "confused",
    "numb", "empty", "blah", "foggy", "fog", "fuzzy", "weird feeling", "meh",
    "can't tell", "cant tell", "mixed feelings", "no idea", "don't know", "dont know",
  ],
  agency: [
    "stuck", "helpless", "powerless", "no control", "out of my control", "trapped",
    "nothing i do", "can't do anything", "cant do anything", "can't decide", "cant decide",
    "no choice", "behind on", "behind schedule", "deadline", "procrastinat", "can't start",
    "cant start", "avoiding", "can't focus", "cant focus", "can't concentrate",
    "unmotivat", "no motivation", "lazy", "failing", "failed", "overdue", "pile",
    "too many", "behind",
  ],
  affect: [
    "bored", "boring", "flat", "nothing feels good", "no joy", "joyless", "can't enjoy",
    "cant enjoy", "anhedon", "rut", "drained", "burned out", "burnt out", "burnout",
    "nothing is fun", "used to love", "grey", "gray", "colorless", "routine",
  ],
  self: [
    "not good enough", "imposter", "impostor", "fraud", "failure", "loser", "hate myself",
    "ashamed of myself", "stupid", "worthless", "useless", "disappoint", "let everyone down",
    "everyone is better", "everyone else", "compared", "comparison", "comparing", "ugly",
    "cringe", "i suck", "i'm bad at", "im bad at", "no confidence", "confidence",
    "embarrassed", "dumb", "inadequate", "not smart", "not talented", "falling behind",
  ],
  connection: [
    "lonely", "loneliness", "alone", "left out", "ignored", "ghosted", "breakup",
    "broke up", "divorce", "argument", "fight with", "fighting with", "fought",
    "excluded", "missing", "miss my", "miss him", "miss her", "miss them", "no friends",
    "no one to talk", "nobody to talk", "disconnect", "new city", "homesick", "partner",
    "boyfriend", "girlfriend", "friend", "family", "roommate", "relationship", "replaying",
  ],
  meaning: [
    "pointless", "meaningless", "what's the point", "whats the point", "why bother",
    "why am i", "no purpose", "purpose", "waste of time", "doesn't matter",
    "doesnt matter", "existential", "going nowhere", "unfulfilled", "stuck in life",
    "wasted", "why do i even", "what am i doing with", "point of all", "bigger picture",
  ],
};

const SITUATIONS: { label: string; words: string[] }[] = [
  { label: "work", words: ["deadline", "boss", "work", "job", "fired", "layoff", "coworker", "interview", "meeting", "promotion", "office", "project", "presentation", "email", "slack", "role", "manager"] },
  { label: "study", words: ["exam", "test", "study", "class", "grade", "assignment", "thesis", "college", "school", "essay", "homework"] },
  { label: "relationship", words: ["breakup", "broke up", "partner", "boyfriend", "girlfriend", "husband", "wife", "relationship", "dating", "divorce", "argument", "fight", "mom", "dad", "parent", "roommate", "friend"] },
  { label: "money", words: ["money", "rent", "bills", "debt", "broke", "salary", "paycheck", "afford"] },
  { label: "sleep / body", words: ["sleep", "insomnia", "3am", "3 am", "sick", "doctor", "health", "chest", "heart"] },
  { label: "life direction", words: ["life", "future", "career", "behind in life", "winning", "everyone around"] },
];

const TRIED_HEALTHY = ["i tried", "already tried", "tried everything", "nothing works", "nothing is working", "didn't help", "didnt help", "therapy", "meditat", "journal", "went for a walk", "walked", "exercise", "talked to"];
const TRIED_UNHEALTHY = ["doomscroll", "doom scroll", "scrolled", "scrolling", "tiktok", "instagram", "reels", "drank", "drinking", "alcohol", "beer", "wine", "smoked", "smoking", "weed", "vape", "binge", "junk food", "napped", "avoiding", "avoided"];

const HEADLINES: Record<MechanismId, string> = {
  safety: "Your alarm system is switched on.",
  clarity: "First, let's name the thing.",
  agency: "Your sense of control took a hit today.",
  affect: "The good-feeling tank is running low.",
  self: "The inner critic has the mic right now.",
  connection: "This one is about disconnection.",
  meaning: "You're underfed on meaning — not broken.",
};

const MESSAGES: Record<MechanismId, string> = {
  safety: "Heart, breath, racing thoughts — your body thinks there's a tiger in the room. There isn't, but your nervous system can't read that memo yet. Nothing else will land until this settles, so we start with the fastest lever: the breath.",
  clarity: "You're flooded, and the feeling has no name yet — that's what makes it feel infinite. Naming a feeling measurably lowers the brain's alarm response. We'll pin it down first; matching the right tool comes after.",
  agency: "The ache isn't the task itself — it's feeling like the wheel slipped out of your hands. So we're not doing motivation. We're doing ownership: sort what's yours from what isn't, then take back one small lever.",
  affect: "When the positivity reservoir runs dry, the whole day reads as gray — that's a signal, not a personality. We're going to log a few real, small goods. Not toxic positivity. Just accurate bookkeeping.",
  self: "Somewhere between the situation and now, the critic grabbed the microphone and started taking questions. It's lying by omission. We're borrowing the voice you already use for people you love — and aiming it inward.",
  connection: "Your nervous system reads disconnection as danger, which is why this feels bigger than it is. One tiny bridge to another human downshifts the alarm on both ends. Two minutes, tops.",
  meaning: "This isn't emptiness — it's a zoom problem. Today is too close to the lens. We'll write from a year out, where this becomes a chapter instead of the whole book, then borrow one move from that future person.",
};

export interface Inference {
  situation: string;
  emotions: { label: string; words: string[]; color: string }[];
  triedHealthy: string[];
  triedUnhealthy: string[];
  scores: Record<MechanismId, number>;
  mechanism: MechanismId;
  alt: MechanismId | null;
  gateNote: string | null;
  headline: string;
  message: string;
  arousal: number; // 0..1
  interventionId: string;
}

function countHits(text: string, patterns: string[]): number {
  let n = 0;
  for (const p of patterns) if (text.includes(p)) n++;
  return n;
}
function hits(text: string, patterns: string[]): string[] {
  return patterns.filter((p) => text.includes(p));
}

export function infer(raw: string): Inference {
  const text = raw.toLowerCase().trim();

  const scores = {} as Record<MechanismId, number>;
  (Object.keys(LEX) as MechanismId[]).forEach((m) => {
    scores[m] = countHits(text, LEX[m]);
  });

  const emotions = EMOTION_FAMILIES.map((f) => ({
    label: f.label,
    color: f.color,
    words: hits(text, f.signals),
  })).filter((e) => e.words.length > 0);

  const situations = SITUATIONS.filter((s) => s.words.some((w) => text.includes(w))).map((s) => s.label);
  const situation = situations.length ? situations.slice(0, 2).join(" · ") : "general / unnamed";

  const triedHealthy = hits(text, TRIED_HEALTHY);
  const triedUnhealthy = hits(text, TRIED_UNHEALTHY);

  const arousalRaw = scores.safety + (emotions.find((e) => e.label.startsWith("angry"))?.words.length ?? 0);
  const arousal = Math.min(1, arousalRaw / 5);

  let mechanism: MechanismId;
  let gateNote: string | null = null;
  let alt: MechanismId | null = null;

  const growthOrder = (["agency", "affect", "self", "connection", "meaning"] as MechanismId[])
    .map((m) => ({ m, s: scores[m] }))
    .sort((a, b) => b.s - a.s);
  const bestGrowth = growthOrder[0].s > 0 ? growthOrder[0].m : null;
  const secondGrowth = growthOrder[1].s > 0 ? growthOrder[1].m : null;

  if (scores.safety >= 2 || (scores.safety >= 1 && arousal >= 0.4)) {
    mechanism = "safety";
    gateNote = "sequence rule: safety first — grounding lands before anything else.";
    alt = "clarity";
  } else if (scores.clarity >= 2 || text.length < 24 || (!bestGrowth && scores.safety === 0)) {
    mechanism = "clarity";
    gateNote = bestGrowth
      ? "sequence rule: clarity before matching — name the feeling, then aim the tool."
      : "no clear pattern yet — completely normal. we name it first, then match.";
    alt = bestGrowth;
  } else {
    mechanism = bestGrowth!;
    alt = secondGrowth ?? "clarity";
    if (mechanism === "agency" && scores.safety === 1 && arousal >= 0.2) {
      gateNote = "mild arousal detected — if breathing feels ragged, start with the sigh instead.";
    }
  }

  // pick the specific intervention inside the mechanism
  const interventionId = pickIntervention(mechanism, text, scores.safety >= 3);

  return {
    situation,
    emotions: emotions.slice(0, 4),
    triedHealthy,
    triedUnhealthy,
    scores,
    mechanism,
    alt,
    gateNote,
    headline: HEADLINES[mechanism],
    message: MESSAGES[mechanism],
    arousal,
    interventionId,
  };
}

export const mechanismName = (id: MechanismId) => MECHANISMS[id].label;

export function pickIntervention(mechanism: MechanismId, raw: string, highArousal = false): string {
  const text = raw.toLowerCase();
  if (mechanism === "safety") {
    return /sleep|insomnia|3 ?am|night/.test(text) || highArousal ? "sigh" : "senses";
  }
  if (mechanism === "clarity") {
    return /numb|can't tell|cant tell|don't know|dont know|blah|fog/.test(text) ? "label" : "unclench";
  }
  return { agency: "control", affect: "gratitude", self: "compassion", connection: "reachout", meaning: "future" }[mechanism];
}
