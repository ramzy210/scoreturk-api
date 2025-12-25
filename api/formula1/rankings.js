// Vercel Serverless Function - Formula 1 Race Rankings
// Proxies requests to API-Formula1 for race rankings (driver positions, results)

const API_F1_URL = 'https://v1.formula-1.api-sports.io';

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
    const { race, type } = req.query;
    
    // type can be: 'races' (race results), 'drivers' (championship), 'teams' (constructor championship)
    // 'fastestlaps', 'startinggrid'
    const rankingType = type || 'races';
    
    const params = new URLSearchParams();
    if (race) params.append('race', race);

    const url = `${API_F1_URL}/rankings/${rankingType}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API-Formula1 error: ${response.status}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('API-Formula1 rankings error:', error);
    return res.status(500).json({ error: 'Failed to fetch F1 rankings' });
  }
}
