// Vercel Serverless Function - Match Events
// Proxies requests to API-Football for match events (goals, cards, subs)

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
    const { fixture } = req.query;
    
    if (!fixture) {
      return res.status(400).json({ error: 'fixture parameter required' });
    }

    const response = await fetch(`${API_FOOTBALL_URL}/fixtures/events?fixture=${fixture}`, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 30 seconds for live events
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Football error:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
