import { NextRequest, NextResponse } from "next/server";
import { searchBusinesses, filterNoWebsite } from "@/lib/google-places";
import { generateBusinessPitch } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { category, location, openaiKey, googlePlacesKey } = await req.json();

    if (!category || !location) {
      return NextResponse.json({ error: "Category and location are required" }, { status: 400 });
    }

    const placesKey = googlePlacesKey || process.env.GOOGLE_PLACES_API_KEY;
    const aiKey = openaiKey || process.env.OPENAI_API_KEY;

    if (!placesKey) {
      return NextResponse.json({ error: "Google Places API key required. Add it in Settings." }, { status: 400 });
    }

    const allBusinesses = await searchBusinesses(category, location, placesKey);
    const noWebsite = filterNoWebsite(allBusinesses);

    let pitch = null;
    if (noWebsite.length > 0 && aiKey) {
      pitch = await generateBusinessPitch(noWebsite, aiKey);
    }

    return NextResponse.json({
      total: allBusinesses.length,
      withoutWebsite: noWebsite.length,
      businesses: allBusinesses,
      noWebsiteBusinesses: noWebsite,
      pitch,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
