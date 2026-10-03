export default async function handler(req, res) {
  // ตั้งค่า CORS ให้เว็บไซต์เรียกใช้งานได้
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { endpoint, lat, lon, uid } = req.query;

  // ดึง API Key จาก Environment Variables ของ Vercel
  const AQICN_TOKEN = process.env.AQICN_API_KEY || 'demo';
  const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

  try {
    if (endpoint === 'stations') {
      // ตัวอย่างพิกัดครอบคลุมพื้นที่สำคัญทั่วโลก (กรุงเทพ, โตเกียว, ลอนดอน, นิวยอร์ก ฯลฯ)
      const bounds = "13.0,100.0,14.0,101.0"; 
      const response = await fetch(`https://api.waqi.info/v2/map/bounds/?latlng=${bounds}&token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    else if (endpoint === 'station_detail') {
      if (!uid) return res.status(400).json({ error: 'Missing uid' });
      const response = await fetch(`https://api.waqi.info/feed/@${uid}/?token=${AQICN_TOKEN}`);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    else if (endpoint === 'weather') {
      if (!lat || !lon) return res.status(400).json({ error: 'Missing coordinates' });
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=th&appid=${OPENWEATHER_KEY}`);
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid endpoint' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch external data', details: error.message });
  }
}
