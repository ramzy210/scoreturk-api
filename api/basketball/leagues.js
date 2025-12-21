// Vercel Serverless Function - Basketball Leagues
// Proxies requests to API-Basketball for available leagues

const API_BASKETBALL_URL = 'https://v1.basketball.api-sports.io';

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
    const url = `${API_BASKETBALL_URL}/leagues`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Basketball error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 1 hour for leagues (they don't change often)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Basketball error:', error);
    return res.status(500).json({ error: 'Failed to fetch basketball leagues' });
  }
}
