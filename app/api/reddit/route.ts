import { NextRequest, NextResponse } from "next/server";
import { searchPainPoints } from "@/lib/reddit";
import { analyzeRedditPainPoints } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { topic, subreddit, openaiKey, redditClientId, redditClientSecret } = await req.json();

    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    const clientId = redditClientId || process.env.REDDIT_CLIENT_ID;
    const clientSecret = redditClientSecret || process.env.REDDIT_CLIENT_SECRET;
    const aiKey = openaiKey || process.env.OPENAI_API_KEY;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Reddit API credentials required. Add them in Settings." }, { status: 400 });
    }
    if (!aiKey) {
      return NextResponse.json({ error: "OpenAI API key required. Add it in Settings." }, { status: 400 });
    }

    const posts = await searchPainPoints(topic, clientId, clientSecret, subreddit);

    if (!posts.length) {
      return NextResponse.json({ opportunities: [], posts: [], message: "No relevant posts found. Try a different topic or subreddit." });
    }

    const analysis = await analyzeRedditPainPoints(posts, aiKey);
    return NextResponse.json({ ...analysis, posts: posts.slice(0, 10) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
