// Vercel Serverless Function - Football Head-to-Head
// Proxies requests to API-Football for H2H fixtures between two teams

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
    const { h2h, last, next, league, season } = req.query;
    
    if (!h2h) {
      return res.status(400).json({ error: 'h2h parameter is required (format: team1Id-team2Id)' });
    }
    
    // Build query string
    const params = new URLSearchParams();
    params.append('h2h', h2h);
    if (last) params.append('last', last);
    if (next) params.append('next', next);
    if (league) params.append('league', league);
    if (season) params.append('season', season);

    const url = `${API_FOOTBALL_URL}/fixtures/headtohead?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 10 minutes for H2H data
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Football H2H error:', error);
    return res.status(500).json({ error: 'Failed to fetch H2H fixtures' });
  }
}
