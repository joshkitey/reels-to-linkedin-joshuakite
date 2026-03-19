// Health coach LinkedIn rewrite engine
// Converts raw transcript into LinkedIn-optimized content

const HOOKS = [
  (topic) => `The ${topic} that changed everything for my client.`,
  (topic) => `I told my client to try this ${topic} hack. 3 weeks later, they couldn't believe the results.`,
  (topic) => `Most people get ${topic} completely wrong. Here's what actually works.`,
  (topic) => `My executive client was skeptical about ${topic}. Until this happened.`,
  (topic) => `Stop scrolling if you struggle with ${topic}. This is the post you've been waiting for.`,
  (topic) => `"I wish someone told me this about ${topic} 10 years ago." — my client last week.`,
  (topic) => `The truth about ${topic} that no one in the wellness space talks about.`,
  (topic) => `I've coached 100+ clients on ${topic}. Here's the #1 mistake I see.`,
  (topic) => `Your ${topic} routine is probably sabotaging your energy. Here's why.`,
  (topic) => `What if everything you believed about ${topic} was wrong?`,
];

const CTAS = [
  "If this resonates, drop a comment below. I read every single one.",
  "Save this post for later — you'll want to come back to it.\n\nFollow me for more actionable health insights.",
  "Share this with someone who needs to hear it today.\n\nP.S. DM me 'ENERGY' if you want my free guide.",
  "What's YOUR biggest struggle with this? Let me know in the comments.\n\nI'm Joshua — I help busy professionals reclaim their energy without overhauling their entire life.",
  "Like this? Repost it to help someone in your network.\n\nFollow for daily health & longevity insights that actually work.",
  "Comment 'YES' if you're ready to make this shift.\n\nDM me to learn how I help clients implement this in just 2 weeks.",
];

const STATS = [
  "Studies show this alone can improve energy levels by up to 27%.",
  "Research from Harvard Medical School backs this up.",
  "83% of my clients report noticeable changes within the first week.",
  "This is backed by over 200 peer-reviewed studies.",
  "The data is clear — and my clients are living proof.",
  "According to recent longevity research, this is non-negotiable.",
];

const TRANSITIONS = [
  "Here's what most people don't realize:",
  "But here's the thing —",
  "Let me break this down:",
  "The science is simple:",
  "After years of coaching, I've learned this:",
  "Here's what I tell every new client:",
];

function extractKeyInsights(transcript) {
  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  const keywords = transcript.toLowerCase();
  const topics = [];

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
    sleep: "sleep optimization",
    rest: "sleep optimization",
    morning: "morning routine",
    routine: "daily routine",
    exercise: "fitness",
    workout: "fitness",
    walk: "movement",
    stretch: "movement",
    yoga: "movement",
    meditat: "mindfulness",
    stress: "stress management",
    anxi: "stress management",
    breath: "breathwork",
    cold: "cold exposure",
    ice: "cold exposure",
    fast: "intermittent fasting",
    coffee: "caffeine optimization",
    caffein: "caffeine optimization",
    energy: "energy optimization",
    focus: "cognitive performance",
    brain: "cognitive performance",
    gut: "gut health",
    digest: "gut health",
    water: "hydration",
    hydrat: "hydration",
    sun: "light exposure",
    light: "light exposure",
    weight: "body composition",
    fat: "body composition",
    muscle: "strength building",
    age: "longevity",
    longev: "longevity",
    inflam: "inflammation reduction",
    immune: "immune optimization",
    skin: "skin health",
    hormone: "hormonal balance",
    testoster: "hormonal balance",
    cortisol: "stress hormones",
  };

  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (keywords.includes(keyword) && !topics.includes(topic)) {
      topics.push(topic);
    }
  }

  if (topics.length === 0) topics.push("health optimization");

  return {
    sentences,
    topics,
    mainTopic: topics[0],
    keyPoints: sentences.slice(0, 5),
  };
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateTextPost(transcript, variant = 0) {
  const { sentences, topics, mainTopic, keyPoints } =
    extractKeyInsights(transcript);

  const hookPool = HOOKS.map((fn) => fn(mainTopic));
  const hook = hookPool[variant % hookPool.length];
  const transition = TRANSITIONS[variant % TRANSITIONS.length];
  const stat = STATS[variant % STATS.length];
  const cta = CTAS[variant % CTAS.length];

  const bodyPoints = keyPoints
    .slice(0, 3)
    .map((point, i) => {
      const prefixes = [
        ["First", "Then", "Finally"],
        ["Step 1:", "Step 2:", "Step 3:"],
        ["The truth is,", "Even better,", "And the best part?"],
      ];
      const prefix = prefixes[variant % prefixes.length][i] || "";
      return `${prefix} ${point.charAt(0).toLowerCase() + point.slice(1)}`;
    })
    .join("\n\n");

  const topicTags = topics
    .slice(0, 3)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const post = `${hook}

${transition}

${bodyPoints}

${stat}

---

${cta}

${topicTags} #healthcoach #longevity #energyoptimization`;

  return {
    content: post,
    hook,
    mainTopic,
    topics,
    variant: variant + 1,
  };
}

function generateCarouselSlides(transcript, variant = 0) {
  const { sentences, topics, mainTopic, keyPoints } =
    extractKeyInsights(transcript);

  const titleTemplates = [
    [
      `The ${mainTopic} hack my clients swear by`,
      (p) => p,
      `${pickRandom(STATS)}`,
      "Save this. Share this.\nYour future self will thank you.",
    ],
    [
      `${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)}: What I wish I knew sooner`,
      (p) => `Most people: "${p}"\n\nWhat actually works:`,
      "The results speak for themselves.",
      "Follow for more insights\nthat actually move the needle.",
    ],
    [
      `5-minute ${mainTopic} protocol for busy professionals`,
      (p) => `Quick win: ${p}`,
      `Why this matters:\n${pickRandom(STATS)}`,
      "DM me 'PROTOCOL'\nfor my complete guide.",
    ],
  ];

  const template = titleTemplates[variant % titleTemplates.length];

  const slides = [
    {
      type: "cover",
      headline: template[0],
      subtitle: `by Joshua Kite | Health & Longevity Coach`,
    },
  ];

  keyPoints.slice(0, 4).forEach((point, i) => {
    slides.push({
      type: "content",
      slideNumber: i + 1,
      headline: `Step ${i + 1}`,
      body:
        typeof template[1] === "function" ? template[1](point) : template[1],
    });
  });

  slides.push({
    type: "proof",
    headline: "Why this works",
    body: template[2],
  });

  slides.push({
    type: "cta",
    headline: template[3],
    subtitle: "Joshua Kite\nHealth & Longevity Coach",
  });

  return {
    slides,
    mainTopic,
    topics,
    variant: variant + 1,
    slideCount: slides.length,
  };
}

export { generateTextPost, generateCarouselSlides, extractKeyInsights };
