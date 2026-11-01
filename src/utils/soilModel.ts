import { FertilityClass, FertilizerSuggestion, RecommendedCrop, SoilReading } from '../types';

export interface CropProfile {
  crop: string;
  nameKey: string;
  nRange: [number, number]; // [min, max]
  pRange: [number, number];
  kRange: [number, number];
  phRange: [number, number];
  tempRange: [number, number];
  moistureRange: [number, number];
  waterReq: string;
  season: string;
  optimalN: number;
  optimalP: number;
  optimalK: number;
  optimalPh: number;
}

// Calibrated against Kaggle 2200-sample Crop Recommendation dataset
export const CROP_PROFILES: CropProfile[] = [
  {
    crop: 'Rice',
    nameKey: 'rice',
    nRange: [60, 100],
    pRange: [35, 60],
    kRange: [35, 45],
    phRange: [5.0, 6.8],
    tempRange: [20, 32],
    moistureRange: [65, 90],
    waterReq: 'High (Puddled / Saturated)',
    season: 'Kharif / Monsoon',
    optimalN: 80,
    optimalP: 48,
    optimalK: 40,
    optimalPh: 6.2
  },
  {
    crop: 'Wheat',
    nameKey: 'wheat',
    nRange: [100, 140],
    pRange: [50, 70],
    kRange: [30, 45],
    phRange: [6.0, 7.5],
    tempRange: [15, 25],
    moistureRange: [45, 65],
    waterReq: 'Medium (4-6 irrigations)',
    season: 'Rabi / Winter',
    optimalN: 120,
    optimalP: 60,
    optimalK: 40,
    optimalPh: 6.8
  },
  {
    crop: 'Cotton',
    nameKey: 'cotton',
    nRange: [90, 140],
    pRange: [40, 65],
    kRange: [15, 30],
    phRange: [6.0, 8.0],
    tempRange: [22, 35],
    moistureRange: [40, 65],
    waterReq: 'Medium-Low (Deep root)',
    season: 'Kharif',
    optimalN: 118,
    optimalP: 47,
    optimalK: 20,
    optimalPh: 6.9
  },
  {
    crop: 'Maize',
    nameKey: 'maize',
    nRange: [60, 100],
    pRange: [35, 60],
    kRange: [15, 25],
    phRange: [5.5, 7.5],
    tempRange: [18, 28],
    moistureRange: [50, 75],
    waterReq: 'Medium',
    season: 'Kharif / Spring',
    optimalN: 78,
    optimalP: 48,
    optimalK: 20,
    optimalPh: 6.5
  },
  {
    crop: 'Chickpea (Gram)',
    nameKey: 'chickpea',
    nRange: [20, 50],
    pRange: [55, 80],
    kRange: [70, 85],
    phRange: [6.0, 7.8],
    tempRange: [15, 25],
    moistureRange: [30, 50],
    waterReq: 'Low (Drought tolerant legume)',
    season: 'Rabi',
    optimalN: 40,
    optimalP: 68,
    optimalK: 80,
    optimalPh: 7.2
  },
  {
    crop: 'Pigeonpeas (Arhar / Tur)',
    nameKey: 'pigeonpeas',
    nRange: [15, 40],
    pRange: [50, 75],
    kRange: [15, 30],
    phRange: [5.5, 7.2],
    tempRange: [20, 35],
    moistureRange: [40, 65],
    waterReq: 'Low',
    season: 'Kharif',
    optimalN: 21,
    optimalP: 68,
    optimalK: 20,
    optimalPh: 6.4
  },
  {
    crop: 'Sugarcane',
    nameKey: 'sugarcane',
    nRange: [120, 180],
    pRange: [50, 80],
    kRange: [50, 90],
    phRange: [6.0, 7.5],
    tempRange: [24, 38],
    moistureRange: [60, 85],
    waterReq: 'Very High',
    season: 'Annual (Perennial)',
    optimalN: 150,
    optimalP: 65,
    optimalK: 70,
    optimalPh: 6.7
  },
  {
    crop: 'Grapes',
    nameKey: 'grapes',
    nRange: [15, 35],
    pRange: [120, 145],
    kRange: [190, 210],
    phRange: [5.8, 7.0],
    tempRange: [15, 32],
    moistureRange: [35, 60],
    waterReq: 'Controlled Drip',
    season: 'Perennial',
    optimalN: 23,
    optimalP: 132,
    optimalK: 200,
    optimalPh: 6.3
  },
  {
    crop: 'Apple',
    nameKey: 'apple',
    nRange: [15, 40],
    pRange: [125, 145],
    kRange: [195, 205],
    phRange: [5.5, 6.8],
    tempRange: [12, 24],
    moistureRange: [50, 70],
    waterReq: 'Medium',
    season: 'Temperate Perennial',
    optimalN: 21,
    optimalP: 135,
    optimalK: 200,
    optimalPh: 6.0
  },
  {
    crop: 'Soybean',
    nameKey: 'soybean',
    nRange: [20, 50],
    pRange: [55, 75],
    kRange: [25, 45],
    phRange: [6.0, 7.2],
    tempRange: [20, 30],
    moistureRange: [55, 75],
    waterReq: 'Medium',
    season: 'Kharif',
    optimalN: 35,
    optimalP: 62,
    optimalK: 35,
    optimalPh: 6.6
  },
  {
    crop: 'Mustard (Sarson)',
    nameKey: 'mustard',
    nRange: [60, 95],
    pRange: [30, 50],
    kRange: [25, 40],
    phRange: [6.0, 7.8],
    tempRange: [12, 25],
    moistureRange: [35, 55],
    waterReq: 'Low',
    season: 'Rabi / Winter',
    optimalN: 80,
    optimalP: 40,
    optimalK: 30,
    optimalPh: 6.8
  },
  {
    crop: 'Groundnut (Peanut)',
    nameKey: 'groundnut',
    nRange: [15, 40],
    pRange: [40, 65],
    kRange: [50, 75],
    phRange: [5.8, 7.2],
    tempRange: [22, 32],
    moistureRange: [45, 65],
    waterReq: 'Low-Medium',
    season: 'Kharif',
    optimalN: 25,
    optimalP: 50,
    optimalK: 60,
    optimalPh: 6.5
  },
  {
    crop: 'Tomato',
    nameKey: 'tomato',
    nRange: [90, 135],
    pRange: [50, 80],
    kRange: [65, 95],
    phRange: [6.0, 7.2],
    tempRange: [18, 28],
    moistureRange: [55, 75],
    waterReq: 'Medium Drip',
    season: 'Rabi / Kharif',
    optimalN: 110,
    optimalP: 65,
    optimalK: 80,
    optimalPh: 6.6
  },
  {
    crop: 'Potato (Aloo)',
    nameKey: 'potato',
    nRange: [100, 150],
    pRange: [60, 90],
    kRange: [90, 130],
    phRange: [5.2, 6.8],
    tempRange: [15, 24],
    moistureRange: [60, 80],
    waterReq: 'Medium',
    season: 'Rabi / Winter',
    optimalN: 130,
    optimalP: 75,
    optimalK: 110,
    optimalPh: 6.0
  },
  {
    crop: 'Onion (Pyaaz)',
    nameKey: 'onion',
    nRange: [75, 110],
    pRange: [40, 65],
    kRange: [55, 85],
    phRange: [6.0, 7.5],
    tempRange: [15, 30],
    moistureRange: [50, 70],
    waterReq: 'Medium',
    season: 'Rabi / Late Kharif',
    optimalN: 90,
    optimalP: 50,
    optimalK: 70,
    optimalPh: 6.8
  },
  {
    crop: 'Chilli (Mirch)',
    nameKey: 'chilli',
    nRange: [90, 135],
    pRange: [50, 75],
    kRange: [55, 85],
    phRange: [6.0, 7.5],
    tempRange: [20, 32],
    moistureRange: [50, 70],
    waterReq: 'Medium',
    season: 'Kharif',
    optimalN: 115,
    optimalP: 60,
    optimalK: 70,
    optimalPh: 6.7
  },
  {
    crop: 'Pomegranate (Anar)',
    nameKey: 'pomegranate',
    nRange: [30, 60],
    pRange: [50, 80],
    kRange: [80, 120],
    phRange: [6.5, 7.8],
    tempRange: [22, 38],
    moistureRange: [35, 55],
    waterReq: 'Low (Drip)',
    season: 'Perennial (Bahar)',
    optimalN: 45,
    optimalP: 65,
    optimalK: 95,
    optimalPh: 7.2
  },
  {
    crop: 'Banana (Kela)',
    nameKey: 'banana',
    nRange: [120, 180],
    pRange: [50, 75],
    kRange: [180, 240],
    phRange: [6.0, 7.5],
    tempRange: [22, 36],
    moistureRange: [65, 85],
    waterReq: 'Very High',
    season: 'Annual',
    optimalN: 150,
    optimalP: 60,
    optimalK: 210,
    optimalPh: 6.7
  },
  {
    crop: 'Sorghum / Jowar',
    nameKey: 'jowar',
    nRange: [45, 80],
    pRange: [25, 45],
    kRange: [25, 50],
    phRange: [6.0, 8.0],
    tempRange: [20, 34],
    moistureRange: [35, 55],
    waterReq: 'Low (Dryland)',
    season: 'Rabi / Kharif',
    optimalN: 60,
    optimalP: 35,
    optimalK: 35,
    optimalPh: 7.2
  },
  {
    crop: 'Pearl Millet / Bajra',
    nameKey: 'bajra',
    nRange: [35, 70],
    pRange: [20, 40],
    kRange: [20, 35],
    phRange: [6.5, 8.2],
    tempRange: [25, 38],
    moistureRange: [25, 45],
    waterReq: 'Low (Arid)',
    season: 'Kharif',
    optimalN: 50,
    optimalP: 30,
    optimalK: 25,
    optimalPh: 7.5
  },
  {
    crop: 'Turmeric (Haldi)',
    nameKey: 'turmeric',
    nRange: [80, 120],
    pRange: [40, 65],
    kRange: [90, 130],
    phRange: [6.0, 7.5],
    tempRange: [20, 35],
    moistureRange: [60, 80],
    waterReq: 'High',
    season: 'Annual',
    optimalN: 95,
    optimalP: 50,
    optimalK: 110,
    optimalPh: 6.8
  }
];

export interface NutrientStatus {
  name: string;
  current: number;
  unit: string;
  optimalRange: [number, number];
  status: 'deficient' | 'optimal' | 'excess';
  scorePct: number;
}

export function evaluateNutrients(n: number, p: number, k: number, ph: number, moisture: number): NutrientStatus[] {
  const getStatus = (val: number, min: number, max: number): 'deficient' | 'optimal' | 'excess' => {
    if (val < min) return 'deficient';
    if (val > max) return 'excess';
    return 'optimal';
  };

  const getScore = (val: number, min: number, max: number): number => {
    if (val >= min && val <= max) return 100;
    if (val < min) return Math.max(10, Math.round((val / min) * 100));
    return Math.max(20, Math.round(100 - ((val - max) / max) * 60));
  };

  return [
    {
      name: 'Nitrogen (N)',
      current: n,
      unit: 'kg/ha',
      optimalRange: [60, 120],
      status: getStatus(n, 60, 120),
      scorePct: getScore(n, 60, 120)
    },
    {
      name: 'Phosphorus (P)',
      current: p,
      unit: 'kg/ha',
      optimalRange: [40, 75],
      status: getStatus(p, 40, 75),
      scorePct: getScore(p, 40, 75)
    },
    {
      name: 'Potassium (K)',
      current: k,
      unit: 'kg/ha',
      optimalRange: [30, 80],
      status: getStatus(k, 30, 80),
      scorePct: getScore(k, 30, 80)
    },
    {
      name: 'Soil pH',
      current: ph,
      unit: 'pH',
      optimalRange: [6.0, 7.5],
      status: getStatus(ph, 6.0, 7.5),
      scorePct: getScore(ph, 6.0, 7.5)
    },
    {
      name: 'Moisture',
      current: moisture,
      unit: '%',
      optimalRange: [40, 70],
      status: getStatus(moisture, 40, 70),
      scorePct: getScore(moisture, 40, 70)
    }
  ];
}

/**
 * Calculates composite Soil Fertility Rating (0-100) and Classification
 */
export function calculateFertilityRating(n: number, p: number, k: number, ph: number, moisture: number): {
  score: number;
  classification: FertilityClass;
} {
  const nutrients = evaluateNutrients(n, p, k, ph, moisture);
  // Weighted contribution: N: 25%, P: 20%, K: 20%, pH: 20%, Moisture: 15%
  const weights = [0.25, 0.20, 0.20, 0.20, 0.15];
  let composite = 0;
  nutrients.forEach((nut, i) => {
    composite += nut.scorePct * weights[i];
  });

  const finalScore = Math.round(Math.min(100, Math.max(10, composite)));

  let classification: FertilityClass = 'Moderate';
  if (finalScore >= 85) classification = 'Optimal';
  else if (finalScore >= 70) classification = 'Good';
  else if (finalScore >= 50) classification = 'Moderate';
  else if (finalScore >= 35) classification = 'Poor';
  else classification = 'Very Poor';

  return { score: finalScore, classification };
}

/**
 * Crop Recommendation multi-target matcher calibrated against Kaggle dataset
 */
export function recommendCrops(
  n: number,
  p: number,
  k: number,
  ph: number,
  temp: number,
  moisture: number
): RecommendedCrop[] {
  const scored = CROP_PROFILES.map(crop => {
    // Normalized distance
    const distN = Math.abs(n - crop.optimalN) / 80;
    const distP = Math.abs(p - crop.optimalP) / 50;
    const distK = Math.abs(k - crop.optimalK) / 60;
    const distPh = Math.abs(ph - crop.optimalPh) / 1.5;
    const distTemp = (temp < crop.tempRange[0] || temp > crop.tempRange[1]) ? 0.35 : 0;
    const distMoisture = (moisture < crop.moistureRange[0] || moisture > crop.moistureRange[1]) ? 0.3 : 0;

    const weightedDist = distN * 0.28 + distP * 0.22 + distK * 0.20 + distPh * 0.15 + distTemp * 0.08 + distMoisture * 0.07;
    const matchScore = Math.max(15, Math.min(99, Math.round(100 * Math.exp(-weightedDist * 1.5))));

    let reason = '';
    if (matchScore >= 85) {
      reason = `Soil parameters strongly align with ${crop.crop}'s high nutrient and pH tolerance (${crop.optimalPh} pH).`;
    } else if (matchScore >= 65) {
      reason = `Good compatibility; slight fertilizer balancing of ${n < crop.optimalN ? 'Nitrogen' : 'Potassium'} recommended.`;
    } else {
      reason = `Marginal suitability due to divergent pH or macronutrient profile.`;
    }

    return {
      crop: crop.crop,
      matchScore,
      reason,
      waterRequirement: crop.waterReq,
      season: crop.season
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}

/**
 * Generates actionable fertilizer prescriptions
 */
export function generateFertilizerPrescription(
  n: number,
  p: number,
  k: number,
  ph: number,
  targetCropName: string = 'General Crops'
): FertilizerSuggestion[] {
  const suggestions: FertilizerSuggestion[] = [];

  // Nitrogen recommendation (Target benchmark: ~90 kg/ha)
  if (n < 60) {
    const deficit = Math.round((90 - n) * 2.17); // Urea is 46% N
    suggestions.push({
      name: 'Urea (46-0-0)',
      dosage: `${deficit} kg/ha`,
      action: 'Add',
      reason: `Nitrogen level (${n} kg/ha) is low. Apply in 2 split top-dressings at 21 and 45 days after sowing.`
    });
  } else if (n > 140) {
    suggestions.push({
      name: 'Nitrogenous Fertilizers',
      dosage: 'Suspend application',
      action: 'Reduce',
      reason: `Excess Nitrogen (${n} kg/ha) causes vegetative lodging and attracts sucking pests like aphids.`
    });
  } else {
    suggestions.push({
      name: 'Urea / Nitrogen',
      dosage: 'Standard maintenance (30 kg/ha)',
      action: 'Maintain',
      reason: `Nitrogen is within the optimal vegetative growth band.`
    });
  }

  // Phosphorus recommendation (Target benchmark: ~55 kg/ha)
  if (p < 35) {
    const dapDose = Math.round((55 - p) * 2.17); // DAP is 46% P2O5
    suggestions.push({
      name: 'Di-Ammonium Phosphate (DAP 18-46-0) or SSP',
      dosage: `${dapDose} kg/ha as basal dose`,
      action: 'Add',
      reason: `Phosphorus is deficient (${p} kg/ha), which inhibits seedling root development and tillering.`
    });
  } else if (p > 90) {
    suggestions.push({
      name: 'Phosphorus / DAP',
      dosage: 'Omit basal P fertilizer',
      action: 'Reduce',
      reason: `High residual soil Phosphorus (${p} kg/ha) can lock out micronutrients like Zinc and Iron.`
    });
  } else {
    suggestions.push({
      name: 'Single Super Phosphate (SSP)',
      dosage: '40 kg/ha basal',
      action: 'Maintain',
      reason: `Soil Phosphorus is stable; provides essential sulfur as secondary nutrient.`
    });
  }

  // Potassium recommendation (Target benchmark: ~50 kg/ha)
  if (k < 30) {
    const mopDose = Math.round((50 - k) * 1.67); // MOP is 60% K2O
    suggestions.push({
      name: 'Muriate of Potash (MOP 0-0-60)',
      dosage: `${mopDose} kg/ha`,
      action: 'Add',
      reason: `Potassium is low (${k} kg/ha), vital for crop disease resistance, stomatal regulation, and grain filling.`
    });
  } else {
    suggestions.push({
      name: 'Potash (MOP)',
      dosage: '25 kg/ha maintenance',
      action: 'Maintain',
      reason: `Adequate Potassium level (${k} kg/ha) supports plant turgor and drought resilience.`
    });
  }

  // pH amendment
  if (ph < 5.8) {
    suggestions.push({
      name: 'Agricultural Lime (CaCO3 / Dolomite)',
      dosage: '250-400 kg/ha broadcasted',
      action: 'Add',
      reason: `Soil is acidic (pH ${ph.toFixed(1)}). Lime raises pH to liberate bound nutrients.`
    });
  } else if (ph > 8.0) {
    suggestions.push({
      name: 'Agricultural Gypsum (CaSO4) & Elemental Sulfur',
      dosage: '200-350 kg/ha',
      action: 'Add',
      reason: `Alkaline/saline soil (pH ${ph.toFixed(1)}). Gypsum displaces sodium and lowers alkalinity.`
    });
  } else {
    suggestions.push({
      name: 'Enriched Vermicompost / Farm Yard Manure',
      dosage: '2.5 tonnes/ha',
      action: 'Maintain',
      reason: `pH ${ph.toFixed(1)} is ideal for microbiological soil activity and cation exchange.`
    });
  }

  return suggestions;
}

/**
 * Parses user-uploaded soil CSV text
 */
export function parseSoilCsv(csvText: string): { n: number; p: number; k: number; ph: number; moisture: number; temp: number } | null {
  try {
    const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return null;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const values = lines[1].split(',').map(v => parseFloat(v.trim()));

    const findVal = (possibleKeys: string[], defaultVal: number): number => {
      for (const key of possibleKeys) {
        const idx = headers.findIndex(h => h === key || h.includes(key));
        if (idx !== -1 && !isNaN(values[idx])) {
          return values[idx];
        }
      }
      return defaultVal;
    };

    return {
      n: findVal(['n', 'nitrogen', 'nitro'], 75),
      p: findVal(['p', 'phosphorus', 'phos'], 45),
      k: findVal(['k', 'potassium', 'potash'], 42),
      ph: findVal(['ph', 'soil_ph'], 6.5),
      moisture: findVal(['moisture', 'humidity', 'soil_moisture'], 55),
      temp: findVal(['temperature', 'temp'], 26)
    };
  } catch (err) {
    console.error('Failed to parse soil CSV', err);
    return null;
  }
}

export function generateSampleCsvContent(): string {
  return `nitrogen_kg_ha,phosphorus_kg_ha,potassium_kg_ha,soil_ph,moisture_pct,temperature_c
82,48,42,6.4,58,26.5
115,35,28,7.1,44,29.0
38,72,85,7.3,38,22.0
`;
}
