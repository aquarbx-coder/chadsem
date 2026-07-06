interface TrendingProduct {
  name: string;
  description: string;
  source: string;
}

export async function searchTrendingProducts(query: string): Promise<TrendingProduct[]> {
  // Use Reddit to find trending products since it's freely available
  // This searches product-related subreddits
  const products: TrendingProduct[] = [];

  try {
    // Search Google via a simple approach - use Reddit's public JSON API
    const subreddits = ["shutupandtakemymoney", "BuyItForLife", "ProductHunting", "ecommerce"];
    const searchQuery = encodeURIComponent(`${query} trending`);

    for (const sub of subreddits.slice(0, 2)) {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/search.json?q=${searchQuery}&sort=hot&limit=15&restrict_sr=true&t=year`,
          { headers: { "User-Agent": "OpportunityAI/1.0" } }
        );

        if (!res.ok) continue;
        const data = await res.json();

        for (const child of data.data?.children || []) {
          const post = child.data;
          if (post.title) {
            products.push({
              name: post.title.slice(0, 100),
              description: (post.selftext || post.title).slice(0, 300),
              source: `r/${sub}`,
            });
          }
        }
      } catch {
        continue;
      }
    }
  } catch {
    // Fallback: return empty
  }

  // Also try Google Trends-style search via public Reddit
  try {
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(`trending product ${query} 2024`)}&sort=relevance&limit=20&t=year`,
      { headers: { "User-Agent": "OpportunityAI/1.0" } }
    );
    if (res.ok) {
      const data = await res.json();
      for (const child of data.data?.children || []) {
        const post = child.data;
        if (post.title && !products.some((p) => p.name === post.title.slice(0, 100))) {
          products.push({
            name: post.title.slice(0, 100),
            description: (post.selftext || post.title).slice(0, 300),
            source: `r/${post.subreddit}`,
          });
        }
      }
    }
  } catch {
    // Continue
  }

  return products.slice(0, 25);
}
