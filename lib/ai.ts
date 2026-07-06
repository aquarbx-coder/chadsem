import OpenAI from "openai";

function getClient(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OpenAI API key is required. Set it in Settings or .env.local");
  return new OpenAI({ apiKey: key });
}

export async function analyzeRedditPainPoints(posts: Array<{ title: string; text: string; subreddit: string; score: number; url: string }>, apiKey?: string) {
  const client = getClient(apiKey);
  const postSummaries = posts.slice(0, 30).map((p, i) => `${i + 1}. [r/${p.subreddit}] (score: ${p.score}) "${p.title}" — ${p.text.slice(0, 200)}`).join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a business opportunity analyst. Analyze Reddit posts expressing pain points and frustrations. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze these Reddit posts for business opportunities. Cluster similar complaints into themes and score each opportunity 0-100.\n\nPosts:\n${postSummaries}\n\nReturn JSON: { "opportunities": [{ "theme": "string", "score": number, "frequency": number, "summary": "string", "examplePosts": ["string"], "productIdea": "string", "targetMarket": "string" }] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
  } catch {
    return { opportunities: [], raw: content };
  }
}

export async function generateBusinessPitch(businesses: Array<{ name: string; types: string[] }>, apiKey?: string) {
  const client = getClient(apiKey);
  const list = businesses.slice(0, 10).map((b) => `- ${b.name} (${b.types.join(", ")})`).join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a sales pitch expert. Generate outreach templates for businesses that don't have websites. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Generate a pitch email template for reaching out to these businesses that lack websites:\n${list}\n\nReturn JSON: { "pitch": { "subject": "string", "body": "string", "followUp": "string" }, "tips": ["string"] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
  } catch {
    return { pitch: { subject: "", body: content, followUp: "" }, tips: [] };
  }
}

export async function analyzeProductTrends(products: Array<{ name: string; description: string; source: string }>, apiKey?: string) {
  const client = getClient(apiKey);
  const list = products.map((p, i) => `${i + 1}. "${p.name}" — ${p.description} (source: ${p.source})`).join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a product trend analyst specializing in e-commerce and dropshipping. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze these trending products for dropshipping/e-commerce opportunity:\n${list}\n\nReturn JSON: { "products": [{ "name": "string", "trendScore": number, "competition": "low|medium|high", "profitPotential": "low|medium|high", "suggestedNiche": "string", "reasoning": "string", "targetAudience": "string" }] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
  } catch {
    return { products: [], raw: content };
  }
}

export async function analyzeCourseOpportunities(posts: Array<{ title: string; text: string; subreddit: string; score: number }>, apiKey?: string) {
  const client = getClient(apiKey);
  const list = posts.slice(0, 30).map((p, i) => `${i + 1}. [r/${p.subreddit}] (score: ${p.score}) "${p.title}" — ${p.text.slice(0, 200)}`).join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an online education market analyst. Identify course opportunities from learning-related Reddit posts. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze these Reddit posts about learning needs. Identify course creation opportunities:\n${list}\n\nReturn JSON: { "courses": [{ "topic": "string", "demandScore": number, "competition": "low|medium|high", "supplyGap": "string", "suggestedOutline": ["string"], "targetAudience": "string", "estimatedPrice": "string" }] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
  } catch {
    return { courses: [], raw: content };
  }
}
