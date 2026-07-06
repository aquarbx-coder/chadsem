interface RedditPost {
  title: string;
  text: string;
  subreddit: string;
  score: number;
  url: string;
  author: string;
  numComments: number;
  created: number;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "OpportunityAI/1.0",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Reddit auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export async function searchReddit(
  query: string,
  clientId: string,
  clientSecret: string,
  subreddit?: string
): Promise<RedditPost[]> {
  const token = await getAccessToken(clientId, clientSecret);

  const baseUrl = subreddit
    ? `https://oauth.reddit.com/r/${subreddit}/search`
    : "https://oauth.reddit.com/search";

  const params = new URLSearchParams({
    q: query,
    sort: "relevance",
    limit: "50",
    t: "year",
    type: "link",
    restrict_sr: subreddit ? "true" : "false",
  });

  const res = await fetch(`${baseUrl}?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "OpportunityAI/1.0",
    },
  });

  if (!res.ok) throw new Error(`Reddit search failed: ${res.status}`);
  const data = await res.json();

  return (data.data?.children || []).map((child: any) => ({
    title: child.data.title,
    text: child.data.selftext || "",
    subreddit: child.data.subreddit,
    score: child.data.score,
    url: `https://reddit.com${child.data.permalink}`,
    author: child.data.author,
    numComments: child.data.num_comments,
    created: child.data.created_utc,
  }));
}

export async function searchPainPoints(
  topic: string,
  clientId: string,
  clientSecret: string,
  subreddit?: string
): Promise<RedditPost[]> {
  const painPhrases = [
    `"I wish" ${topic}`,
    `"why can't" ${topic}`,
    `"frustrated with" ${topic}`,
    `"someone should build" ${topic}`,
    `"there should be" ${topic}`,
    `"hate that" ${topic}`,
  ];

  const results: RedditPost[] = [];
  for (const phrase of painPhrases.slice(0, 3)) {
    try {
      const posts = await searchReddit(phrase, clientId, clientSecret, subreddit);
      results.push(...posts);
    } catch {
      // Continue with other searches
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return results.filter((post) => {
    if (seen.has(post.url)) return false;
    seen.add(post.url);
    return true;
  });
}

export async function searchLearningPosts(
  topic: string,
  clientId: string,
  clientSecret: string
): Promise<RedditPost[]> {
  const queries = [
    `"how do I learn" ${topic}`,
    `"best course for" ${topic}`,
    `"tutorial for" ${topic}`,
    `"resources for learning" ${topic}`,
  ];

  const results: RedditPost[] = [];
  for (const q of queries.slice(0, 3)) {
    try {
      const posts = await searchReddit(q, clientId, clientSecret);
      results.push(...posts);
    } catch {
      // Continue
    }
  }

  const seen = new Set<string>();
  return results.filter((post) => {
    if (seen.has(post.url)) return false;
    seen.add(post.url);
    return true;
  });
}
