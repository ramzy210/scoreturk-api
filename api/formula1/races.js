// Vercel Serverless Function - Formula 1 Races
// Proxies requests to API-Formula1 for races

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
    const { season, competition, date, next, last } = req.query;
    
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (competition) params.append('competition', competition);
    if (date) params.append('date', date);
    if (next) params.append('next', next);
    if (last) params.append('last', last);

    const url = `${API_F1_URL}/races?${params.toString()}`;
    
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
    console.error('API-Formula1 error:', error);
    return res.status(500).json({ error: 'Failed to fetch F1 races' });
  }
}
