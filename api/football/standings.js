// Vercel Serverless Function - League Standings
// Proxies requests to API-Football for league standings

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
    const { league, season } = req.query;
    
    if (!league || !season) {
      return res.status(400).json({ error: 'league and season parameters required' });
    }

    const response = await fetch(`${API_FOOTBALL_URL}/standings?league=${league}&season=${season}`, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 10 minutes for standings
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Football error:', error);
    return res.status(500).json({ error: 'Failed to fetch standings' });
  }
}
