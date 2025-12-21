// Vercel Serverless Function - MMA Fights
// Proxies requests to API-MMA for fights/events
// Note: API-Sports doesn't have a dedicated MMA API, but we can use a similar structure

const API_MMA_URL = 'https://v1.mma.api-sports.io';

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
    const { league, season, date, fighter } = req.query;
    
    const params = new URLSearchParams();
    if (league) params.append('league', league);
    if (season) params.append('season', season);
    if (date) params.append('date', date);
    if (fighter) params.append('fighter', fighter);

    const url = `${API_MMA_URL}/fights?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-MMA error: ${response.status}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-MMA error:', error);
    return res.status(500).json({ error: 'Failed to fetch MMA fights' });
  }
}
