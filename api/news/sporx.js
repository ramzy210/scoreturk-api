export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://www.sporx.com/rss/futbol.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ScoreTurk/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null && items.length < 10) {
      const itemXml = match[1];
      
      const getTagContent = (tag) => {
        const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
        const m = itemXml.match(regex);
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      
      const title = getTagContent('title');
      const link = getTagContent('link');
      const description = getTagContent('description').replace(/<[^>]*>/g, '').substring(0, 200);
      const pubDate = getTagContent('pubDate');
      
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/);
      const mediaMatch = itemXml.match(/<media:content[^>]*url="([^"]*)"[^>]*>/);
      const imgMatch = itemXml.match(/<img[^>]*src="([^"]*)"[^>]*/);
      const image = enclosureMatch?.[1] || mediaMatch?.[1] || imgMatch?.[1] || '';
      
      if (title && link) {
        items.push({
          title,
          link,
          description,
          pubDate,
          image
        });
      }
    }

    return res.status(200).json({
      success: true,
      source: 'Sporx',
      items
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      items: []
    });
  }
}
