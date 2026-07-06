import { NextRequest, NextResponse } from "next/server";
import { searchTrendingProducts } from "@/lib/scrapers";
import { analyzeProductTrends } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { query, openaiKey } = await req.json();

    if (!query) return NextResponse.json({ error: "Search query is required" }, { status: 400 });

    const aiKey = openaiKey || process.env.OPENAI_API_KEY;
    if (!aiKey) {
      return NextResponse.json({ error: "OpenAI API key required. Add it in Settings." }, { status: 400 });
    }

    const products = await searchTrendingProducts(query);

    if (!products.length) {
      return NextResponse.json({ products: [], message: "No trending products found. Try a different query." });
    }

    const analysis = await analyzeProductTrends(products, aiKey);
    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
