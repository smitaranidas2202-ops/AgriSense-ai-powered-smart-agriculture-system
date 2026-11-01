export interface WeatherResult {
  temperature: number; // °C
  humidity: number; // %
  rainfall: number; // mm in 24h
  windSpeed: number; // km/h
  weatherCondition: string;
  locationName: string;
  source: 'live_api' | 'manual';
}

export interface FarmingLocation {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  defaultCrop: string;
}

export const POPULAR_FARMING_REGIONS: FarmingLocation[] = [
  { name: 'Nashik (Vineyards & Onions)', state: 'Maharashtra', country: 'India', lat: 19.9975, lon: 73.7898, defaultCrop: 'Grapes' },
  { name: 'Pune (Sugarcane & Veggies)', state: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567, defaultCrop: 'Sugarcane' },
  { name: 'Nagpur (Cotton & Citrus)', state: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882, defaultCrop: 'Cotton' },
  { name: 'Ludhiana (Wheat & Rice)', state: 'Punjab', country: 'India', lat: 30.9010, lon: 75.8573, defaultCrop: 'Wheat' },
  { name: 'Guntur (Chilli & Cotton)', state: 'Andhra Pradesh', country: 'India', lat: 16.3067, lon: 80.4365, defaultCrop: 'Cotton' },
  { name: 'Indore (Soybean & Wheat)', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lon: 75.8577, defaultCrop: 'Soybean' },
  { name: 'Karnal (Basmati Rice & Wheat)', state: 'Haryana', country: 'India', lat: 29.6857, lon: 76.9905, defaultCrop: 'Rice' },
  { name: 'Central Valley (Fruit & Almonds)', state: 'California', country: 'USA', lat: 36.7378, lon: -119.7871, defaultCrop: 'Apple' },
];

/**
 * Fetches real live weather data from Open-Meteo free API
 */
export async function fetchLiveWeather(lat: number, lon: number, locationName: string): Promise<WeatherResult> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=precipitation_sum&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather fetch failed: ${response.statusText}`);
    }
    const data = await response.json();

    const temp = Math.round(data.current?.temperature_2m ?? 27.5);
    const humidity = Math.round(data.current?.relative_humidity_2m ?? 68);
    const rain = Math.round((data.daily?.precipitation_sum?.[0] ?? data.current?.precipitation ?? 1.2) * 10) / 10;
    const wind = Math.round(data.current?.wind_speed_10m ?? 12.4);
    const code = data.current?.weather_code ?? 1;

    let condition = 'Clear Sky';
    if (code >= 51 && code <= 67) condition = 'Light to Moderate Rain';
    else if (code >= 80 && code <= 99) condition = 'Thunderstorms / Heavy Rain';
    else if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Foggy / Dew';

    return {
      temperature: temp,
      humidity,
      rainfall: rain,
      windSpeed: wind,
      weatherCondition: condition,
      locationName,
      source: 'live_api'
    };
  } catch (err) {
    console.warn('Falling back to default microclimate weather', err);
    // Graceful offline agricultural fallback
    return {
      temperature: 28,
      humidity: 72,
      rainfall: 4.5,
      windSpeed: 11,
      weatherCondition: 'Humid & Overcast',
      locationName: locationName || 'Regional Agro-Zone',
      source: 'manual'
    };
  }
}
