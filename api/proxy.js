export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, lat, lon, uid, keyword } = req.query;
  const AQICN_TOKEN = process.env.AQICN_TOKEN;
  const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

  try {
    if (endpoint === 'stations') {
      const bounds = "5.0,97.0,21.0,106.0";
      const response = await fetch(`https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    else if (endpoint === 'feed' && uid) {
      const response = await fetch(`https://api.waqi.info/feed/${uid}/?token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    else if (endpoint === 'station_detail' && uid) {
      const response = await fetch(`https://api.waqi.info/feed/${uid}/?token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    else if (endpoint === 'search' && keyword) {
      const response = await fetch(`https://api.waqi.info/search/?keyword=${encodeURIComponent(keyword)}&token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    else if (endpoint === 'weather' && lat && lon) {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=th&appid=${OPENWEATHER_KEY}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    return res.status(400).json({ error: 'Invalid endpoint or parameters' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
