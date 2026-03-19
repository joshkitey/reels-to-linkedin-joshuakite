// Health coach LinkedIn rewrite engine
// Framework: Hook (tension + lived experience) → Story (Before > Then > After) → Insight → CTA

// ── HOOKS ──
// Short, punchy, lived experience, numbers, tension without giving away the solution
const HOOKS = [
  (topic, points) =>
    `3 weeks ago my client was burning out from bad ${topic}.\nThen she made 1 tiny change.`,
  (topic, points) =>
    `6 months ago I couldn't get through a day without crashing by 2pm.\nDoctors said nothing was wrong.`,
  (topic, points) =>
    `2 years ago I slept 4 hours a night.\nStarted getting subtle chest pains.\nThen one day a sharp pain in my left chest woke me up.`,
  (topic, points) =>
    `I've worked with 147 clients on ${topic}.\n92% of them were making the same mistake.`,
  (topic, points) =>
    `8 weeks ago a CEO told me he hadn't had a full night's sleep in 3 years.\nHe was about to quit his company.`,
  (topic, points) =>
    `Last month I watched a 42-year-old executive break down in our session.\nHe'd been ignoring his ${topic} for a decade.`,
  (topic, points) =>
    `4 months ago my energy was so bad I cancelled 3 client calls in one week.\nThat was my wake-up call.`,
  (topic, points) =>
    `I used to think ${topic} was about willpower.\n11 years of coaching proved me dead wrong.`,
  (topic, points) =>
    `My client lost 23 pounds in 12 weeks.\nBut that's not why she cried on our last call.`,
  (topic, points) =>
    `5 years ago I was the unhealthiest health coach you've ever met.\nNobody knew.`,
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
