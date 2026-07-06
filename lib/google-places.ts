interface Business {
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalRatings: number;
  types: string[];
  hasWebsite: boolean;
  website?: string;
  placeId: string;
}

export async function searchBusinesses(
  query: string,
  location: string,
  apiKey: string
): Promise<Business[]> {
  // First, geocode the location
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const geoRes = await fetch(geocodeUrl);
  if (!geoRes.ok) throw new Error(`Geocoding failed: ${geoRes.status}`);
  const geoData = await geoRes.json();

  if (!geoData.results?.[0]) throw new Error(`Location not found: ${location}`);

  const { lat, lng } = geoData.results[0].geometry.location;

  // Search for businesses
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=10000&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error(`Places search failed: ${searchRes.status}`);
  const searchData = await searchRes.json();

  if (!searchData.results?.length) return [];

  // Get details for each place (check for website)
  const businesses: Business[] = [];
  const places = searchData.results.slice(0, 20);

  for (const place of places) {
    try {
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,website,types&key=${apiKey}`;
      const detailRes = await fetch(detailUrl);
      const detailData = await detailRes.json();
      const d = detailData.result;

      businesses.push({
        name: d.name || place.name,
        address: d.formatted_address || place.formatted_address || "",
        phone: d.formatted_phone_number || "",
        rating: d.rating || place.rating || 0,
        totalRatings: d.user_ratings_total || 0,
        types: (d.types || place.types || []).slice(0, 3),
        hasWebsite: !!d.website,
        website: d.website,
        placeId: place.place_id,
      });
    } catch {
      // Skip place if details fail
    }
  }

  return businesses;
}

export function filterNoWebsite(businesses: Business[]): Business[] {
  return businesses.filter((b) => !b.hasWebsite);
}
