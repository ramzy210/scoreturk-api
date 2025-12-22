// Vercel Serverless Function - Football Teams Search
// Proxies requests to API-Football for team search

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
    // Get query parameters
    const { search, id, league, season, country } = req.query;
    
    // Build query string
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (id) params.append('id', id);
    if (league) params.append('league', league);
    if (season) params.append('season', season);
    if (country) params.append('country', country);

    const url = `${API_FOOTBALL_URL}/teams?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 1 hour for team searches (teams don't change often)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Football error:', error);
    return res.status(500).json({ error: 'Failed to fetch teams' });
  }
}
