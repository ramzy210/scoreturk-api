// Vercel Serverless Function - Available Leagues
// Proxies requests to API-Football for league information

const API_FOOTBALL_URL = 'https://v3.football.api-sports.io';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { country, season, current } = req.query;
    
    // Build query string
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (season) params.append('season', season);
    if (current) params.append('current', current);

    const url = `${API_FOOTBALL_URL}/leagues?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 1 hour for leagues
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Football error:', error);
    return res.status(500).json({ error: 'Failed to fetch leagues' });
  }
}
