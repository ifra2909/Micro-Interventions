export type MechanismId =
  | "safety"
  | "clarity"
  | "agency"
  | "affect"
  | "self"
  | "connection"
  | "meaning";

export interface Mechanism {
  id: MechanismId;
  label: string;
  need: string;
  color: string; // hex
  gate?: 1 | 2;
  blurb: string;
}

export const MECHANISMS: Record<MechanismId, Mechanism> = {
  safety: {
    id: "safety",
    label: "safety",
    need: "nervous system regulation",
    color: "#7cd9a6",
    gate: 1,
    blurb: "the alarm is ringing. gratitude can't land until the body knows you're not being chased.",
  },
  clarity: {
    id: "clarity",
    label: "clarity",
    need: "emotional labeling",
    color: "#8fc9e8",
    gate: 2,
    blurb: "the feeling has no name yet. naming it measurably turns the volume down.",
  },
  agency: {
    id: "agency",
    label: "agency",
    need: "sense of control",
    color: "#f0b45b",
    blurb: "the ache isn't the task — it's feeling like the wheel slipped out of your hands.",
  },
  affect: {
    id: "affect",
    label: "positive affect",
    need: "positivity refill",
    color: "#f4896b",
    blurb: "your good-feeling reservoir is running on fumes. everything reads as 'blah'.",
  },
  self: {
    id: "self",
    label: "self-regard",
    need: "a kinder inner voice",
    color: "#e790a6",
    blurb: "the inner critic is chairing the meeting right now. it's time to take back the mic.",
  },
  connection: {
    id: "connection",
    label: "connection",
    need: "human contact",
    color: "#efb990",
    blurb: "humans regulate through other humans. one tiny bridge works faster than you'd think.",
  },
  meaning: {
    id: "meaning",
    label: "meaning",
    need: "a bigger why",
    color: "#b7a3e4",
    blurb: "not broken — undernourished on purpose. reconnect today to something bigger than today.",
  },
};

export const MECHANISM_ORDER: MechanismId[] = [
  "safety",
  "clarity",
  "agency",
  "affect",
  "self",
  "connection",
  "meaning",
];

export type WidgetId =
  | "breath"
  | "checklist"
  | "label"
  | "control"
  | "gratitude"
  | "compassion"
  | "reachout"
  | "future";

export interface Intervention {
  id: string;
  mechanism: MechanismId;
  title: string;
  minutes: number;
  evidence: string;
  why: string;
  steps: string[];
  widget: WidgetId;
  checklist?: { group: string; items: string[] }[];
  closer: string;
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: "sigh",
    mechanism: "safety",
    title: "the physiological sigh",
    minutes: 2,
    evidence: "Balban et al., 2023, Cell Reports Medicine — cyclic sighing beat box breathing on mood and arousal in a 28-day RCT.",
    why: "Two short inhales re-inflate collapsed air sacs; the long exhale flips the switch toward your calming nervous system. It's the fastest lever we know of — it works even when you don't believe it will.",
    steps: [
      "Sit or stand. Feet flat. One hand on chest, one on belly.",
      "Breathe in through the nose — then a quick second sip of air on top.",
      "Exhale slowly through the mouth, longer than the inhale. Like fogging a mirror, gently.",
      "Repeat with the pacer below. Six rounds is plenty.",
    ],
    widget: "breath",
    closer: "Notice your shoulders. They moved, didn't they.",
  },
  {
    id: "senses",
    mechanism: "safety",
    title: "5·4·3·2·1 grounding",
    minutes: 3,
    evidence: "Core distress-tolerance skill in CBT/DBT protocols — pulls attention out of the spiral and into the senses.",
    why: "Spirals live in imagined futures. Your senses only report the present. Counting down forces your attention back to the only moment that's actually happening.",
    steps: [
      "Look up from the screen. Actually — do it now.",
      "Work down the list below out loud if you can. Whispering counts.",
      "Take your time with each one. Slower is stronger.",
    ],
    widget: "checklist",
    checklist: [
      { group: "5 things you can see", items: ["one", "two", "three", "four", "five"] },
      { group: "4 things you can feel", items: ["fabric / chair", "feet on floor", "air on skin", "one more"] },
      { group: "3 things you can hear", items: ["near sound", "far sound", "faintest sound"] },
      { group: "2 things you can smell", items: ["one", "two (or two you like)"] },
      { group: "1 thing you can taste", items: ["right now"] },
    ],
    closer: "You're here — not in the spiral. Big difference.",
  },
  {
    id: "label",
    mechanism: "clarity",
    title: "name it to tame it",
    minutes: 2,
    evidence: "Lieberman et al., 2007, Psychological Science — putting feelings into words reliably reduces amygdala response.",
    why: "Vague dread is loud; a named feeling is smaller. You're not analyzing or solving — just pointing at the thing and giving it a word. That alone downshifts the alarm.",
    steps: [
      "Scan the words below. Don't think — notice which ones flinch.",
      "Pick up to three. Mixed feelings are allowed. They're normal.",
      "Set the intensity honestly. A 4 you can live with beats a fake 1.",
      "Finish the sentence. One line. Ugly grammar welcome.",
    ],
    widget: "label",
    closer: "A named feeling is a smaller feeling. You did the hardest rep.",
  },
  {
    id: "unclench",
    mechanism: "clarity",
    title: "the 60-second unclench",
    minutes: 2,
    evidence: "Body-scan style interoception from MBSR (Kabat-Zinn) — noticing and releasing tension lowers arousal and sharpens emotional signal.",
    why: "When the mind floods, the body keeps the score first. Releasing it zone by zone gives your feelings a quieter room to speak in — suddenly you can tell what's actually there.",
    steps: [
      "Close your eyes or soften your gaze.",
      "Work through the checklist slowly — find each spot, then let it go.",
      "After the last one, ask: 'what's underneath?' Whatever surfaces is your real feeling.",
    ],
    widget: "checklist",
    checklist: [
      { group: "release, top to bottom", items: ["unclench the jaw", "drop the tongue from the roof of the mouth", "let the shoulders fall an inch", "soften the belly", "unclench the hands", "widen your gaze — panoramic, not laser"] },
    ],
    closer: "Looser body, clearer signal. Whatever came up — that's the one to work with.",
  },
  {
    id: "control",
    mechanism: "agency",
    title: "the control audit",
    minutes: 4,
    evidence: "Circles of control (Stoic/CBT lineage) + implementation intentions (Gollwitzer, 1999) — specific when/where plans roughly double follow-through.",
    why: "Helplessness comes from gripping everything at once. Sorting 'mine' from 'not mine' hands your energy back — and one concrete next action turns dread into a to-do.",
    steps: [
      "Write the 2–3 things swirling about this situation. Messy is fine.",
      "Tag each one: is it actually yours to control?",
      "Release the rest — not forever, just for today.",
      "Name one small next action that IS yours, and pin it to a when + where.",
    ],
    widget: "control",
    closer: "Small wheel, held firmly. That's how the big ones get steered.",
  },
  {
    id: "gratitude",
    mechanism: "affect",
    title: "three good things, micro",
    minutes: 4,
    evidence: "Seligman, Steen, Park & Peterson, 2005 — 'three good things' raised happiness and lowered depressive symptoms for up to 6 months.",
    why: "Your brain files threats automatically and deletes good moments by default. Writing three down — and why they happened — retrains the filing system. Small and unimpressive entries count double.",
    steps: [
      "Think back over just today. Lower the bar. Coffee counts.",
      "Log three things that were even slightly good.",
      "For each, add WHY it happened — you're allowed to take some credit.",
    ],
    widget: "gratitude",
    closer: "The ledger just got heavier on the good side. Same day, better file.",
  },
  {
    id: "compassion",
    mechanism: "self",
    title: "the friend reframe",
    minutes: 4,
    evidence: "Self-compassion training (Neff & Germer, 2013, RCT) reduces shame loops and builds resilience faster than self-criticism ever has.",
    why: "You would never say today's inner monologue to someone you love. This exercise borrows the voice you already have for others and points it where it's needed. Same words, kinder address.",
    steps: [
      "Acknowledge the moment out loud: 'this is a rough one.' Not dramatic. Just true.",
      "Remember: every human in your office, your feed, your family has stood exactly here. You're not uniquely broken.",
      "Write what you'd text your best friend if they sent you this exact situation.",
      "Now read it back — to yourself, in your own name.",
    ],
    widget: "compassion",
    closer: "The kindest person you know was you all along. Keep that voice on speed dial.",
  },
  {
    id: "reachout",
    mechanism: "connection",
    title: "the 2-minute reach-out",
    minutes: 3,
    evidence: "Prosocial contact and small acts of kindness reliably lift mood on both sides (Lyubomirsky, 2005; Dunn & Norton).",
    why: "Disconnection tells your nervous system you're alone with the threat. One small bridge — even a two-line message — flips that. Bonus: it usually makes the other person's day, which loops back around.",
    steps: [
      "Pick one person. The first name that came to mind is the right one.",
      "Draft something tiny below. No essay. 'Thinking of you' beats a novel.",
      "Actually send it. Then check the box — this part matters.",
    ],
    widget: "reachout",
    closer: "Connection is a boomerang. You just threw a good one.",
  },
  {
    id: "future",
    mechanism: "meaning",
    title: "one year from now",
    minutes: 5,
    evidence: "'Best possible self' exercise (King, 2001; Malouff & Schutte, 2017 meta-analysis) reliably lifts mood, optimism and sense of direction.",
    why: "Pointlessness is a zoom problem — today is too close to the lens. Writing from a year out forces perspective: this becomes a chapter, not the whole book. Then you borrow one move from that future person.",
    steps: [
      "One year from today, this is behind you. Write 2–3 sentences from that side.",
      "What did getting through it teach you? What did it build?",
      "Pick one tiny thing 'future you' would do this week. Claim it.",
    ],
    widget: "future",
    closer: "Future-you is already proud of you. Go meet them halfway.",
  },
];

export const interventionById = (id: string) =>
  INTERVENTIONS.find((i) => i.id === id)!;

export interface EmotionFamily {
  id: string;
  label: string;
  color: string;
  words: string[]; // for the labeling widget
  signals: string[]; // regex fragments for detection
}

export const EMOTION_FAMILIES: EmotionFamily[] = [
  {
    id: "anxious", label: "anxious / afraid", color: "#8fc9e8",
    words: ["anxious", "worried", "scared", "dread", "on edge", "panic", "nervous", "jumpy"],
    signals: ["anxious", "anxiety", "worried", "worrying", "scared", "afraid", "dread", "panic", "panick", "nervous", "on edge", "jumpy", "paranoid", "terrified", "fear"],
  },
  {
    id: "sad", label: "sad / heavy", color: "#8fc9e8",
    words: ["sad", "heavy", "down", "blue", "heartbroken", "grieving", "melancholy"],
    signals: ["sad", "sadness", "depressed", "down", "heartbroken", "heart broke", "grieving", "grief", "crying", "cry", "tears", "miserable", "heavy heart"],
  },
  {
    id: "angry", label: "angry / irritated", color: "#f4896b",
    words: ["angry", "furious", "irritated", "resentful", "frustrated", "fed up"],
    signals: ["angry", "anger", "furious", "pissed", "irritat", "resent", "frustrat", "fed up", "annoyed", "rage", "mad at"],
  },
  {
    id: "shame", label: "ashamed / embarrassed", color: "#e790a6",
    words: ["ashamed", "embarrassed", "guilty", "cringe", "exposed", "humiliated"],
    signals: ["ashamed", "shame", "embarrass", "guilty", "guilt", "cringe", "humiliat", "mortified", "exposed"],
  },
  {
    id: "lonely", label: "lonely / unseen", color: "#efb990",
    words: ["lonely", "unseen", "left out", "invisible", "homesick", "missed"],
    signals: ["lonely", "loneliness", "alone", "left out", "invisible", "unseen", "isolated", "homesick", "no one", "nobody"],
  },
  {
    id: "overwhelm", label: "overwhelmed / flooded", color: "#7cd9a6",
    words: ["overwhelmed", "flooded", "drowning", "too much", "buried", "swamped"],
    signals: ["overwhelm", "too much", "drowning", "flooded", "buried", "swamped", "everything at once", "can't cope", "cant cope"],
  },
  {
    id: "numb", label: "numb / flat", color: "#b7a3e4",
    words: ["numb", "empty", "flat", "blank", "detached", "meh"],
    signals: ["numb", "empty", "flat", "blank", "detached", "nothing", "meh", "don't feel", "dont feel", "can't feel", "cant feel"],
  },
  {
    id: "tired", label: "drained / burned out", color: "#f0b45b",
    words: ["exhausted", "drained", "burned out", "wired", "depleted", "spent"],
    signals: ["exhaust", "drained", "burnt out", "burned out", "burnout", "tired", "wired", "depleted", "no energy", "spent"],
  },
];

export const QUICK_CHIPS: { label: string; text: string }[] = [
  { label: "deadline panic", text: "I have a huge deadline in two days, I'm behind on everything, and my chest gets tight just thinking about it." },
  { label: "after an argument", text: "I had a fight with my partner and now I keep replaying every dumb thing I said over and over." },
  { label: "3am brain", text: "I can't sleep, my heart is racing and my thoughts won't stop spiraling about work." },
  { label: "doomscroll hole", text: "I've been doomscrolling for two hours instead of doing the thing I'm avoiding. I feel awful." },
  { label: "feeling behind", text: "Everyone around me seems to be winning and I'm falling behind in life. What's even the point." },
  { label: "imposter at work", text: "I feel like a fraud in my new role. Everyone else is smarter and I'm just not good enough." },
  { label: "lonely tonight", text: "I moved to a new city three months ago. I don't really know anyone here and the evenings are so lonely." },
  { label: "just… numb", text: "I don't even know what I feel. Everything is just blah lately and I can't enjoy anything." },
];

export const LABEL_WORDS: { word: string; family: string }[] = EMOTION_FAMILIES.flatMap(
  (f) => f.words.map((w) => ({ word: w, family: f.id }))
);

export const CITATIONS = [
  "Seligman, Steen, Park & Peterson (2005) — Positive psychology progress, American Psychologist.",
  "Lieberman et al. (2007) — Putting feelings into words, Psychological Science.",
  "Gollwitzer (1999) — Implementation intentions, American Psychologist.",
  "King (2001) — Best possible selves, Journal of Personality & Social Psychology.",
  "Lyubomirsky, Sheldon & Schkade (2005) — Pursuing happiness, Review of General Psychology.",
  "Neff & Germer (2013) — Mindful self-compassion RCT, Journal of Clinical Psychology.",
  "Balban et al. (2023) — Cyclic sighing vs box breathing, Cell Reports Medicine.",
  "Malouff & Schutte (2017) — Best possible self meta-analysis, Journal of Happiness Studies.",
];

export interface SessionEntry {
  id: string;
  ts: number;
  mechanism: MechanismId;
  interventionId: string;
  snippet: string;
  before: number;
  after: number;
  manual: boolean;
}
