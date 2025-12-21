// Vercel Serverless Function - Baseball Games
// Proxies requests to API-Baseball for games/fixtures

const API_BASEBALL_URL = 'https://v1.baseball.api-sports.io';

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
    const { league, season, date, team, live } = req.query;
    
    const params = new URLSearchParams();
    if (league) params.append('league', league);
    if (season) params.append('season', season);
    if (date) params.append('date', date);
    if (team) params.append('team', team);
    if (live) params.append('live', live);

    const url = `${API_BASEBALL_URL}/games?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Baseball error: ${response.status}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Baseball error:', error);
    return res.status(500).json({ error: 'Failed to fetch baseball games' });
  }
}
