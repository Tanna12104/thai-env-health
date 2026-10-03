export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, lat, lon, uid, keyword } = req.query;
  const AQICN_TOKEN = process.env.AQICN_API_KEY || process.env.AQICN_TOKEN;
  const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    if (endpoint === 'stations') {
      const bounds = req.query.bounds || "5.0,97.0,21.0,106.0"; 
      const response = await fetch(`https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    else if (endpoint === 'feed' && uid) {
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
      if (!OPENWEATHER_KEY) {
        return res.status(500).json({ status: 'error', message: 'OpenWeather API key not configured on server' });
      }
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    else {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing endpoint parameters' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
