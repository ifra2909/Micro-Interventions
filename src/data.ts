export type MechanismId =
  | "safety"
  | "clarity"
  | "affect"
  | "agency"
  | "self"
  | "connection"
  | "meaning";

export interface Mechanism {
  id: MechanismId;
  label: string;
  need: string;
  color: string;
  gate?: 1 | 2;
  blurb: string;
}

export const MECHANISMS: Record<MechanismId, Mechanism> = {
  safety: {
    id: "safety",
    label: "safety",
    need: "nervous system regulation",
    color: "#A8C4BC",
    gate: 1,
    blurb: "the alarm is ringing. nothing else lands until the body knows you're safe.",
  },
  clarity: {
    id: "clarity",
    label: "clarity",
    need: "emotional labeling",
    color: "#A8B8C8",
    gate: 2,
    blurb: "the feeling has no name yet. naming it measurably turns the volume down.",
  },
  affect: {
    id: "affect",
    label: "positive affect",
    need: "positivity refill",
    color: "#D4B4A8",
    blurb: "your good-feeling reservoir is running on fumes. everything reads as gray.",
  },
  agency: {
    id: "agency",
    label: "agency",
    need: "sense of control",
    color: "#D4C4A8",
    blurb: "the ache isn't the task — it's feeling like the wheel slipped out of your hands.",
  },
  self: {
    id: "self",
    label: "self-compassion",
    need: "a kinder inner voice",
    color: "#C8A8A8",
    blurb: "the inner critic is chairing the meeting right now. time to take back the mic.",
  },
  connection: {
    id: "connection",
    label: "connection",
    need: "human contact",
    color: "#B8A8C8",
    blurb: "humans regulate through other humans. one tiny bridge works faster than you'd think.",
  },
  meaning: {
    id: "meaning",
    label: "meaning",
    need: "a bigger why",
    color: "#B4A8C0",
    blurb: "not broken — undernourished on purpose. reconnect today to something bigger.",
  },
};

export const MECHANISM_ORDER: MechanismId[] = [
  "safety",
  "clarity",
  "affect",
  "agency",
  "self",
  "connection",
  "meaning",
];

export type WidgetId =
  | "breath"
  | "checklist"
  | "label"
  | "bodyscan"
  | "gratitude"
  | "savor"
  | "smallwin"
  | "bestself"
  | "compassion"
  | "humanity"
  | "lovingkindness"
  | "reachout"
  | "silverlining"
  | "values";

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
  preferWhen?: string;
  closer: string;
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: "sigh",
    mechanism: "safety",
    title: "the physiological sigh",
    minutes: 1,
    evidence: "Balban et al. (2023, Cell Reports Medicine) — cyclic sighing beat box breathing on mood and arousal in a 28-day RCT.",
    why: "The double inhale re-inflates tiny air sacs in your lungs, and the long exhale activates your parasympathetic nervous system — your body's built-in brake pedal — signaling safety within seconds.",
    steps: [
      "Take one deep breath in through your nose.",
      "Before exhaling, take a second short 'sip' of air on top of that breath.",
      "Exhale slowly and fully through your mouth — long and controlled.",
      "Repeat 2–3 times.",
    ],
    widget: "breath",
    preferWhen: "panic, racing heart, shortness of breath, or 'can't calm down'",
    closer: "your nervous system just got the memo. you're safe.",
  },
  {
    id: "grounding",
    mechanism: "safety",
    title: "5·4·3·2·1 grounding",
    minutes: 2,
    evidence: "Widely used sensory grounding technique in CBT and trauma-informed care; consistent with Kabat-Zinn's (2009) present-moment awareness foundation.",
    why: "This engages all five senses, pulling your attention out of anxious internal loops and anchoring it in the present physical environment — which your brain reads as 'right now, in this moment, I am safe.'",
    steps: [
      "Name 5 things you can see right now (look around slowly).",
      "Name 4 things you can physically feel (feet on floor, chair on back, air on skin).",
      "Name 3 things you can hear (near and far).",
      "Name 2 things you can smell (or two smells you like).",
      "Name 1 thing you can taste (or take one slow sip of water).",
    ],
    widget: "checklist",
    checklist: [
      { group: "5 things you can see", items: ["one", "two", "three", "four", "five"] },
      { group: "4 things you can feel", items: ["fabric / chair", "feet on floor", "air on skin", "one more"] },
      { group: "3 things you can hear", items: ["near sound", "far sound", "faintest sound"] },
      { group: "2 things you can smell", items: ["one", "two (or two you like)"] },
      { group: "1 thing you can taste", items: ["right now"] },
    ],
    preferWhen: "dissociation, numbness, 'not real,' 'floating,' or feeling disconnected from body",
    closer: "you're here — not in the spiral. big difference.",
  },
  {
    id: "label",
    mechanism: "clarity",
    title: "name it to tame it",
    minutes: 1,
    evidence: "Lieberman et al. (2007, Psychological Science) — putting feelings into words reliably reduces amygdala response.",
    why: "Putting a precise word on a vague feeling shifts activity from your emotional alarm center to your thinking brain, reducing its intensity and giving you back a sense of grip.",
    steps: [
      "Pause and ask yourself: 'What am I actually feeling right now?'",
      "Scan this list and pick the closest match: sad, anxious, angry, ashamed, lonely, tired, overwhelmed, disappointed, jealous, or scared.",
      "Say it (out loud or in your head): 'Right now, I feel [emotion].'",
      "Notice where it sits in your body (chest, throat, stomach) for one breath.",
    ],
    widget: "label",
    preferWhen: "vague input ('off,' 'bad,' 'weird,' 'down') or 'I don't know what I'm feeling'",
    closer: "a named feeling is a smaller feeling. you did the hardest rep.",
  },
  {
    id: "bodyscan",
    mechanism: "clarity",
    title: "body scan snapshot",
    minutes: 2,
    evidence: "Adapted from Kabat-Zinn's (2009) body scan (Full Catastrophe Living); mindfulness-based body awareness is a recognized regulatory precursor in PPI frameworks.",
    why: "Your body often registers stress before your mind can name it. This 60-second scan surfaces the physical signature of what you're feeling, making the emotion easier to identify and address.",
    steps: [
      "Close your eyes or soften your gaze.",
      "Starting at the top of your head, slowly move your attention down through your body — head, shoulders, chest, stomach, legs, feet.",
      "At each area, simply notice: tight, warm, heavy, buzzing, numb, or neutral? Don't fix anything. Just notice.",
      "When you find the strongest sensation, stay with it for three slow breaths.",
    ],
    widget: "bodyscan",
    preferWhen: "'I don't know what's wrong' but describes physical discomfort (tight chest, heavy body, tension)",
    closer: "looser body, clearer signal. whatever came up — that's the one to work with.",
  },
  {
    id: "gratitude",
    mechanism: "affect",
    title: "three good things",
    minutes: 3,
    evidence: "Seligman, Steen, Park & Peterson (2005, American Psychologist) — 'three good things' exercise produced significant increases in happiness and decreases in depressive symptoms for six months.",
    why: "Your brain has a negativity bias that filters out small positives under stress. Deliberately retrieving three good things counteracts that filter and retrains your attention toward what's working.",
    steps: [
      "Think of three things that went even slightly well today — however small (good coffee, a text, sunlight, finishing a task).",
      "For each one, write it down or say it aloud.",
      "For each, add one sentence: 'This happened because ___' or 'This mattered to me because ___.'",
      "Notice any shift in your body as you do this.",
    ],
    widget: "gratitude",
    preferWhen: "low mood, flatness, 'nothing good happened,' or general negativity",
    closer: "the ledger just got heavier on the good side. same day, better file.",
  },
  {
    id: "savor",
    mechanism: "affect",
    title: "savor the small thing",
    minutes: 2,
    evidence: "Bryant & Veroff (2007, Savoring: A New Model of Positive Experience); Bryant (2003): savoring associated with higher happiness and life satisfaction, fewer depressive symptoms.",
    why: "Savoring deliberately prolongs the pleasurable effect of a positive experience instead of letting it pass unnoticed — stretching one small good moment further than your stressed brain would normally allow.",
    steps: [
      "Pick one small pleasant thing available right now — a taste, a sound, a texture, a view, a memory.",
      "Give it your full attention for 60 seconds. Notice details you'd normally skip.",
      "If your mind wanders to worries, gently return to the sensory detail.",
      "When done, say or think: 'That was good.'",
    ],
    widget: "savor",
    preferWhen: "mildly low but not in crisis; has access to a sensory experience (food, music, nature, warmth)",
    closer: "you just stretched one small good moment. that's the whole game.",
  },
  {
    id: "smallwin",
    mechanism: "agency",
    title: "one small win",
    minutes: 3,
    evidence: "Grounded in Bandura's self-efficacy theory (mastery experiences as most powerful efficacy source) and Lyubomirsky, Sheldon & Schkade's (2005) intentional activity model.",
    why: "Completing even a micro-task generates a real-time signal of competence and control — the exact opposite of helplessness — and rebuilds your sense that your actions matter.",
    steps: [
      "Ask yourself: 'What is one tiny thing I can complete in the next 2 minutes?' (Examples: make the bed, reply to one message, wash one dish, file one paper, stretch for 60 seconds.)",
      "Do that one thing — fully, right now.",
      "When done, pause and acknowledge: 'I did that. I made something happen.'",
    ],
    widget: "smallwin",
    preferWhen: "'stuck,' 'can't do anything,' 'no control,' 'pointless,' or describes task paralysis/procrastination",
    closer: "small wheel, held firmly. that's how the big ones get steered.",
  },
  {
    id: "bestself",
    mechanism: "agency",
    title: "best possible self (micro)",
    minutes: 4,
    evidence: "King (2001, Personality and Social Psychology Bulletin): writing about best possible future self significantly improved subjective well-being and was linked to fewer illness visits.",
    why: "This shifts your brain from threat-mode ('what if it goes wrong?') to approach-mode ('what if it goes right?') and converts vague hope into one concrete, doable next step.",
    steps: [
      "Imagine yourself one week from now, having handled this current situation as well as you realistically could.",
      "Write or say 2–3 sentences describing what that version of you did and how it felt.",
      "Identify ONE action from that description you could take in the next 24 hours.",
      "Commit to that one action.",
    ],
    widget: "bestself",
    preferWhen: "hopeless about a specific situation, or describes low confidence about an upcoming event",
    closer: "future-you is already proud of you. go meet them halfway.",
  },
  {
    id: "compassion",
    mechanism: "self",
    title: "self-compassionate note",
    minutes: 3,
    evidence: "Neff (2003a, 2003b) self-compassion model; MacBeth & Gumley (2012) meta-analysis: self-compassion strongly inversely related to depression/anxiety (r = -.54).",
    why: "Self-criticism activates your threat system as if an enemy were attacking you. Speaking to yourself with the same warmth you'd offer a friend switches off that internal attack and activates your care system instead.",
    steps: [
      "Think of the thing you're criticizing yourself for right now.",
      "Ask: 'What would I say to a close friend who told me they did this exact thing?'",
      "Write or say those words to yourself — using 'you' or your own name.",
      "Place a hand on your chest or shoulder while you read it back.",
    ],
    widget: "compassion",
    preferWhen: "harsh self-talk: 'I'm stupid,' 'I hate myself,' 'failure,' 'not good enough,' 'ashamed'",
    closer: "the kindest person you know was you all along. keep that voice on speed dial.",
  },
  {
    id: "humanity",
    mechanism: "self",
    title: "common humanity reset",
    minutes: 2,
    evidence: "Neff (2003b): 'common humanity' as core component of self-compassion; Pennock & Alberts Toolkit identifies common humanity vs. isolation as key mechanism.",
    why: "Isolating shame ('it's just me, I'm broken') amplifies stress. Remembering that struggle is a shared human experience reduces the shame layer and makes the pain more bearable.",
    steps: [
      "Think of what you're struggling with right now.",
      "Say to yourself: 'This is a moment of struggle. Struggle is part of being human. Right now, someone else on this planet is feeling exactly what I'm feeling.'",
      "Take one slow breath and let that land — you are not alone in this experience, even if you feel like you are.",
    ],
    widget: "humanity",
    preferWhen: "shame, 'I'm the only one,' 'something's wrong with me,' or isolates themselves because of how they feel",
    closer: "you're not uniquely broken. you're human. that's the whole point.",
  },
  {
    id: "lovingkindness",
    mechanism: "connection",
    title: "loving-kindness micro",
    minutes: 3,
    evidence: "Fredrickson, Cohn, Coffey, Pek & Finkel (2008, JPSP): loving-kindness meditation increased positive emotions, life satisfaction, and reduced depressive symptoms over 7 weeks.",
    why: "Generating warm, connected feelings toward someone you care about activates your brain's affiliation system — the same system that loneliness starves — producing a felt sense of connection even when you're physically alone.",
    steps: [
      "Bring to mind one person (or pet) you care about — someone it's easy to feel warmth toward.",
      "Silently repeat: 'May you be safe. May you be well. May you be happy.'",
      "Picture them receiving this wish. Notice any warmth in your own chest.",
      "If comfortable, extend the same wish to yourself: 'May I be safe. May I be well. May I be happy.'",
    ],
    widget: "lovingkindness",
    preferWhen: "loneliness, isolation, 'no one cares,' or emotional coldness",
    closer: "connection is a boomerang. you just threw a good one.",
  },
  {
    id: "reachout",
    mechanism: "connection",
    title: "reach out (micro-connection)",
    minutes: 3,
    evidence: "Active-constructive responding and gratitude expression strengthen social bonds (Gable, Reis, Impett & Asher, 2004). Social relationships are among the strongest predictors of happiness.",
    why: "Loneliness convinces you that connection is unavailable. Taking one small action toward another person breaks that spell — you become someone who reaches out, not just someone who waits.",
    steps: [
      "Think of one person in your life — any person — who has been kind to you, helped you, or simply exists and matters to you.",
      "Send them a short message right now: a thank you, a 'thinking of you,' or a simple check-in. It can be one sentence.",
      "If messaging isn't possible, write the message anyway (you don't have to send it) and notice how it feels to direct warmth outward.",
    ],
    widget: "reachout",
    preferWhen: "lonely but has at least one contact they can name; 'no one cares' but can identify one person when prompted",
    closer: "connection is a boomerang. you just threw a good one.",
  },
  {
    id: "silverlining",
    mechanism: "meaning",
    title: "the silver lining (benefit finding)",
    minutes: 3,
    evidence: "Meaning-making and benefit-finding are established coping mechanisms (Folkman & Moskowitz, 2000). Meaning-based PPIs show consistent links to happiness and life satisfaction (Steger, Kashdan & Oishi, 2008).",
    why: "Finding one genuine benefit inside a difficulty doesn't erase the pain — it widens the frame so the pain isn't the only thing in view, which restores a sense of meaning and forward motion.",
    steps: [
      "Think of the current stressor or a recent difficulty.",
      "Ask yourself: 'Has anything come out of this that I wouldn't trade? Did I learn something, grow, or discover something about myself or others?'",
      "Write or say one sentence: 'Even though this is hard, one thing that has come from it is ___.'",
      "Sit with that for one breath — not to minimize the pain, but to hold both.",
    ],
    widget: "silverlining",
    preferWhen: "ruminating on a specific stressor, says 'why is this happening,' or is stuck in a loop",
    closer: "the pain is still there. but now it's not the only thing in the room.",
  },
  {
    id: "values",
    mechanism: "meaning",
    title: "values compass (micro)",
    minutes: 3,
    evidence: "Values-based action is core to ACT (Hayes, Strosahl & Wilson, 1999). Bull's-Eye Values Survey (Lundgren et al., 2012) shows values-action discrepancy correlates with distress; reducing it improves psychological flexibility.",
    why: "When stress flattens everything into 'just get through it,' reconnecting to a chosen value reminds you that this moment is still part of your life — and you get to decide what it stands for.",
    steps: [
      "Ask yourself: 'In this moment, what kind of person do I want to be — even in this small situation?'",
      "Pick one word: kind, honest, brave, patient, curious, present, strong, gentle.",
      "Ask: 'What is one tiny action I could take in the next hour that would be me living that value?'",
      "Do it, or schedule it concretely.",
    ],
    widget: "values",
    preferWhen: "'what's the point,' 'nothing matters,' 'going through the motions,' or feels existentially flat but is not in acute crisis",
    closer: "you just chose what this moment stands for. that's agency.",
  },
];

export const interventionById = (id: string) =>
  INTERVENTIONS.find((i) => i.id === id)!;

export interface EmotionFamily {
  id: string;
  label: string;
  color: string;
  words: string[];
  signals: string[];
}

export const EMOTION_FAMILIES: EmotionFamily[] = [
  {
    id: "anxious", label: "anxious / afraid", color: "#A8B8C8",
    words: ["anxious", "worried", "scared", "dread", "on edge", "panic", "nervous", "jumpy"],
    signals: ["anxious", "anxiety", "worried", "worrying", "scared", "afraid", "dread", "panic", "panick", "nervous", "on edge", "jumpy", "paranoid", "terrified", "fear"],
  },
  {
    id: "sad", label: "sad / heavy", color: "#A8B8C8",
    words: ["sad", "heavy", "down", "blue", "heartbroken", "grieving", "melancholy"],
    signals: ["sad", "sadness", "depressed", "down", "heartbroken", "heart broke", "grieving", "grief", "crying", "cry", "tears", "miserable", "heavy heart"],
  },
  {
    id: "angry", label: "angry / irritated", color: "#D4B4A8",
    words: ["angry", "furious", "irritated", "resentful", "frustrated", "fed up"],
    signals: ["angry", "anger", "furious", "pissed", "irritat", "resent", "frustrat", "fed up", "annoyed", "rage", "mad at"],
  },
  {
    id: "shame", label: "ashamed / embarrassed", color: "#C8A8A8",
    words: ["ashamed", "embarrassed", "guilty", "cringe", "exposed", "humiliated"],
    signals: ["ashamed", "shame", "embarrass", "guilty", "guilt", "cringe", "humiliat", "mortified", "exposed"],
  },
  {
    id: "lonely", label: "lonely / unseen", color: "#B8A8C8",
    words: ["lonely", "unseen", "left out", "invisible", "homesick", "missed"],
    signals: ["lonely", "loneliness", "alone", "left out", "invisible", "unseen", "isolated", "homesick", "no one", "nobody"],
  },
  {
    id: "overwhelm", label: "overwhelmed / flooded", color: "#A8C4BC",
    words: ["overwhelmed", "flooded", "drowning", "too much", "buried", "swamped"],
    signals: ["overwhelm", "too much", "drowning", "flooded", "buried", "swamped", "everything at once", "can't cope", "cant cope"],
  },
  {
    id: "numb", label: "numb / flat", color: "#B4A8C0",
    words: ["numb", "empty", "flat", "blank", "detached", "meh"],
    signals: ["numb", "empty", "flat", "blank", "detached", "nothing", "meh", "don't feel", "dont feel", "can't feel", "cant feel"],
  },
  {
    id: "tired", label: "drained / burned out", color: "#D4C4A8",
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

export const LABEL_BOARD: { word: string; color: string }[] = [
  ["anxious", "#8BA7B8"], ["overwhelmed", "#7BA89F"], ["sad", "#8BA7B8"], ["angry", "#C26D53"],
  ["ashamed", "#C28B8B"], ["lonely", "#A89BC2"], ["numb", "#9B8AA6"], ["exhausted", "#C9A876"],
  ["guilty", "#C28B8B"], ["scared", "#8BA7B8"], ["resentful", "#C26D53"], ["empty", "#9B8AA6"],
  ["embarrassed", "#C28B8B"], ["worried", "#8BA7B8"], ["frustrated", "#C26D53"], ["drained", "#C9A876"],
  ["left out", "#A89BC2"], ["dreading", "#8BA7B8"], ["inadequate", "#C28B8B"], ["flat", "#9B8AA6"],
].map(([word, color]) => ({ word, color }));

export const CITATIONS = [
  "Seligman, Steen, Park & Peterson (2005) — Positive psychology progress, American Psychologist.",
  "Lieberman et al. (2007) — Putting feelings into words, Psychological Science.",
  "King (2001) — Best possible selves, Journal of Personality & Social Psychology.",
  "Neff & Germer (2013) — Mindful self-compassion RCT, Journal of Clinical Psychology.",
  "Balban et al. (2023) — Cyclic sighing vs box breathing, Cell Reports Medicine.",
  "Bryant & Veroff (2007) — Savoring: A New Model of Positive Experience.",
  "Fredrickson et al. (2008) — Loving-kindness meditation, Journal of Personality and Social Psychology.",
  "Kabat-Zinn (2009) — Full Catastrophe Living: Mindfulness-based stress reduction.",
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
