// Health coach LinkedIn rewrite engine
// Framework: Hook (tension + lived experience) → Story (Before > Then > After) → Insight → CTA

// ── HOOKS ──
// Short, punchy, lived experience, numbers, tension without giving away the solution
const HOOKS = [
  (topic) =>
    `2 years ago I slept 4 hours a night.\nStarted getting subtle chest pains.\nThen one day a sharp pain in my left chest woke me up.`,
  (topic) =>
    `6 months ago my client was drinking 6 coffees a day.\nHer hands started shaking in meetings.\nHer doctor told her she was heading for adrenal failure.`,
  (topic) =>
    `3 weeks ago a CEO messaged me at 2am.\nHe hadn't slept properly in 3 years.\nHis wife had just told him she was leaving.`,
  (topic) =>
    `8 months ago I collapsed in my kitchen.\nI'd been ignoring the warning signs for years.\nMy blood work came back and the numbers terrified me.`,
  (topic) =>
    `Last year I watched a 38-year-old client break down on a call.\nShe'd gained 30 pounds in 12 months.\nHer doctor said "everything looks normal."`,
  (topic) =>
    `4 months ago my client's energy was so bad she missed her daughter's recital.\nShe sat in the car park crying.\nThat was the day she finally called me.`,
  (topic) =>
    `I've seen 147 clients make the same ${topic} mistake.\n92% of them didn't know until the damage was done.\nOne ended up in hospital.`,
  (topic) =>
    `11 years ago I was the unhealthiest health coach alive.\nI hid it from everyone.\nThen my body gave me an ultimatum I couldn't ignore.`,
  (topic) =>
    `5 weeks ago a busy exec told me he hadn't felt "normal" in 2 years.\nHe was popping pills just to get through the day.\nHis family barely recognised him anymore.`,
  (topic) =>
    `9 months ago my client's ${topic} was so bad she quit her job.\nShe thought she was broken.\nEvery specialist said there was nothing wrong.`,
];

// ── STORY TEMPLATES ──
// Before > Then this happened > After (5 lines max)
const STORIES = [
  (before, insight) =>
    `Before: ${before}\nI was exhausted, frustrated, and ready to give up.\n\nThen I discovered something that changed everything.\n\nWithin 2 weeks, the difference was night and day.`,
  (before, insight) =>
    `The old way: grinding through the day on caffeine and willpower.\nThe breaking point: my body finally said no.\n\nSo I stripped everything back to basics.\n\n3 weeks later — I didn't recognise my own energy.`,
  (before, insight) =>
    `She came to me running on empty. 6 coffees. Zero energy by lunch.\n\nI gave her one protocol. Just one.\n\nDay 14: "I feel like a different person."`,
  (before, insight) =>
    `For years I told myself "I'll fix this later."\nLater never came. My health got worse.\n\nUntil I made one non-negotiable change.\n\nEverything shifted.`,
  (before, insight) =>
    `He was doing everything "right." Gym 5x a week. Clean eating.\nStill felt terrible.\n\nTurns out he was missing the one thing that actually mattered.\n\nOnce we fixed it — everything clicked.`,
  (before, insight) =>
    `I used to wake up dreading the day ahead.\nNo energy. No motivation. Just survival mode.\n\nOne conversation changed my entire approach.\n\nNow I wake up before my alarm. Every single day.`,
];

// ── INSIGHT/FRAMEWORK SECTION ──
const INSIGHTS = [
  (points) =>
    `Here's what most people get wrong:\n\nIt's not about doing more. It's about doing the right thing at the right time.\n\n${points[0] || "The body doesn't lie. Listen to it."}`,
  (points) =>
    `The framework is simple:\n\n1. ${points[0] || "Fix the foundation first"}\n2. ${points[1] || "Remove what's draining you"}\n3. ${points[2] || "Add what actually fuels you"}\n\nThat's it. No complicated protocols.`,
  (points) =>
    `What I've learned after 1,000+ coaching sessions:\n\n${points[0] || "Small changes compound faster than big overhauls."}\n\nThe people who win aren't the most disciplined.\nThey're the ones who find what works for THEIR body.`,
  (points) =>
    `Here's the truth nobody talks about:\n\n${points[0] || "Your body is giving you signals every single day."}\n\nThe question isn't whether you can feel better.\nIt's whether you'll stop ignoring what's right in front of you.`,
  (points) =>
    `The insight that changed everything for me:\n\n${points[0] || "Health isn't about perfection. It's about consistency."}\n\nOnce you understand this, the pressure drops.\nAnd ironically — that's when the results show up.`,
];

// ── CTAs ──
const CTAS = [
  "If this hit home — drop a comment.\nI read every single one.",
  "Save this. Come back to it when you need the reminder.\n\nFollow for more insights that actually move the needle.",
  "Share this with someone who needs to hear it.\n\nP.S. DM me 'ENERGY' for my free protocol.",
  "What's the one thing you've been ignoring about your health?\n\nTell me in the comments. I'll reply to every one.\n\nI'm Joshua — I help busy professionals reclaim their energy without overhauling their life.",
  "Repost this if it resonated.\n\nFollow me for daily health insights that don't require a PhD to understand.",
  "Comment 'READY' if you're done settling for low energy.\n\nDM me to see how I help clients fix this in 2 weeks.",
];

// ── TOPIC DETECTION ──
const topicMap = {
  smoothie: "nutrition",
  recipe: "nutrition",
  food: "nutrition",
  eat: "nutrition",
  diet: "nutrition",
  meal: "nutrition",
  protein: "nutrition",
  vitamin: "nutrition",
  supplement: "nutrition",
  sleep: "sleep",
  rest: "sleep",
  morning: "morning routine",
  routine: "daily routine",
  exercise: "fitness",
  workout: "fitness",
  walk: "movement",
  stretch: "movement",
  yoga: "movement",
  meditat: "mindfulness",
  stress: "stress",
  anxi: "stress",
  breath: "breathwork",
  cold: "cold exposure",
  ice: "cold exposure",
  fast: "fasting",
  coffee: "caffeine",
  caffein: "caffeine",
  energy: "energy",
  focus: "focus",
  brain: "cognitive performance",
  gut: "gut health",
  digest: "gut health",
  water: "hydration",
  hydrat: "hydration",
  sun: "light exposure",
  light: "light exposure",
  weight: "body composition",
  fat: "body composition",
  muscle: "strength",
  age: "longevity",
  longev: "longevity",
  inflam: "inflammation",
  immune: "immune health",
  skin: "skin health",
  hormone: "hormones",
  testoster: "hormones",
  cortisol: "stress hormones",
};

function extractKeyInsights(transcript) {
  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  const keywords = transcript.toLowerCase();
  const topics = [];

  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (keywords.includes(keyword) && !topics.includes(topic)) {
      topics.push(topic);
    }
  }

  if (topics.length === 0) topics.push("health");

  return {
    sentences,
    topics,
    mainTopic: topics[0],
    keyPoints: sentences.slice(0, 5),
  };
}

// ── MAIN GENERATOR ──
function generateTextPost(transcript, variant = 0) {
  const { sentences, topics, mainTopic, keyPoints } =
    extractKeyInsights(transcript);

  const hook = HOOKS[variant % HOOKS.length](mainTopic, keyPoints);
  const story = STORIES[variant % STORIES.length](
    keyPoints[0] || "I was stuck",
    keyPoints[1] || ""
  );
  const insight = INSIGHTS[variant % INSIGHTS.length](keyPoints);
  const cta = CTAS[variant % CTAS.length];

  const topicTags = topics
    .slice(0, 3)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const post = `${hook}

${story}

${insight}

---

${cta}

${topicTags} #healthcoach #longevity #energy`;

  return {
    content: post,
    hook,
    mainTopic,
    topics,
    variant: variant + 1,
  };
}

export { generateTextPost, extractKeyInsights };
