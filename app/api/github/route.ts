import { NextResponse } from 'next/server';

export const revalidate = 43200; // Cache the response completely for 12 hours (43200 seconds)

export async function GET() {
  const username = '1Anuraag0';
  
  try {
    // We execute these strictly on Vercel's server backend!
    const [profileRes, readmeRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    ]);

    const profile = await profileRes.json();
    const repos = await reposRes.json();
    
    // Parse BIO cleanly from the markdown response
    const readmeText = await readmeRes.text();
    let cleanBio = null;
    if (readmeRes.ok) {
      const aboutMatch = readmeText.match(/# 💫 About Me:[\s\S]*?\n([^#]+)/);
      if (aboutMatch && aboutMatch[1]) {
        cleanBio = aboutMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/🔹/g, '•').trim();
      }
    }

    // Safety fallback
    if (profile.message?.includes('rate limit') || !Array.isArray(repos)) {
      return NextResponse.json({ error: "Rate limit hit" }, { status: 429 });
    }

    // Optimize language bytes logic to execute entirely server-side so the client browser never gets limits
    const ownRepos = repos.filter((r: any) => !r.fork && r.name.toLowerCase() !== username.toLowerCase());
    const langTotals: Record<string, number> = {};
    
    // Fetch individual language maps for the top 15 repositories
    const langFetches = ownRepos.slice(0, 15).map((repo: any) => 
      fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`)
        .then(res => res.ok ? res.json() : {})
        .then((langs: any) => {
          Object.entries(langs).forEach(([lang, bytes]) => {
            langTotals[lang] = (langTotals[lang] || 0) + (bytes as number);
          });
        })
        .catch(() => {})
    );

    // Make sure we wait for all language parsing to finish
    await Promise.all(langFetches);

    // Return the perfectly formatted single payload to the client!
    return NextResponse.json({
      profile,
      bio: cleanBio,
      repos: ownRepos,
      langTotals
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
  }
}
