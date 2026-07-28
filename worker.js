/**
 * Cloudflare Worker: GitHub repo proxy for portfolio site.
 *
 * Deploy this as its OWN worker (separate from your "portfolio" site worker),
 * e.g. named "gh-repos-proxy" so it lands at:
 *   https://gear.ddenoon748.workers.dev
 * Called from portfolio.html via fetchGitHubRepos().
 *
 * Why this exists:
 * - GitHub's public API rate-limits unauthenticated requests to 60/hr per IP,
 *   which is shared across everyone visiting your site from the same network/CDN edge.
 * - This worker calls GitHub once (using a token, if provided) from Cloudflare's
 *   own IPs, caches the response at the edge, and serves it to all visitors —
 *   avoiding rate-limit failures and adding CORS headers your static site needs.
 */

const GITHUB_USERNAME = 'Gear-I';
const CACHE_TTL_SECONDS = 3600; // re-fetch from GitHub at most once per hour

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const cache = caches.default;
    const cacheKey = new Request(request.url, request);

    // Serve from Cloudflare edge cache if present
    let response = await cache.match(cacheKey);
    if (response) {
      return response;
    }

    const apiUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

    const githubHeaders = {
      'User-Agent': 'portfolio-worker',
      'Accept': 'application/vnd.github+json',
    };

    // Optional: set a GITHUB_TOKEN secret (wrangler secret put GITHUB_TOKEN)
    // to raise the rate limit from 60/hr to 5,000/hr.
    if (env.GITHUB_TOKEN) {
      githubHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
    }

    try {
      const githubResponse = await fetch(apiUrl, { headers: githubHeaders });

      if (!githubResponse.ok) {
        return jsonResponse(
          { error: `GitHub API responded with ${githubResponse.status}` },
          githubResponse.status
        );
      }

      const repos = await githubResponse.json();

      // Trim payload to only what the site needs
      const trimmed = repos
        .filter(r => !r.private)
        .map(r => ({
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          fork: r.fork,
          language: r.language,
          topics: r.topics || [],
          stargazers_count: r.stargazers_count,
          updated_at: r.updated_at,
        }));

      response = jsonResponse(trimmed, 200, CACHE_TTL_SECONDS);

      // Store in edge cache (respects the Cache-Control header set below)
      ctx.waitUntil(cache.put(cacheKey, response.clone()));

      return response;
    } catch (err) {
      return jsonResponse({ error: 'Failed to fetch from GitHub', detail: err.message }, 502);
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200, cacheTtl = 0) {
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders(),
  };
  if (cacheTtl > 0) {
    headers['Cache-Control'] = `public, max-age=${cacheTtl}`;
  }
  return new Response(JSON.stringify(data), { status, headers });
}// JavaScript source code
