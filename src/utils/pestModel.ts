import { GrowthStage, PestDetail, PestRiskAssessment, PestRiskLevel, SprayAdvisory } from '../types';

export interface CropPestThreatDatabase {
  crop: string;
  pests: {
    name: string;
    scientificName: string;
    vulnerableStages: GrowthStage[];
    tempRange: [number, number];
    minHumidity: number;
    maxHumidity?: number;
    rainSensitivity: 'high' | 'moderate' | 'drought_favoring';
    symptoms: string;
    management: string;
    bioPesticide: string;
  }[];
}

export const PEST_DATABASE: Record<string, CropPestThreatDatabase> = {
  'Cotton': {
    crop: 'Cotton',
    pests: [
      {
        name: 'Pink Bollworm',
        scientificName: 'Pectinophora gossypiella',
        vulnerableStages: ['Flowering', 'Fruiting'],
        tempRange: [22, 34],
        minHumidity: 60,
        rainSensitivity: 'moderate',
        symptoms: 'Rosetted flowers, burrow holes in squares and developing bolls with larval frass.',
        management: 'Install 5 pheromone traps/acre; spray Profenofos 50% EC @ 2ml/L if trap catch exceeds 8 moths/night for 3 consecutive days.',
        bioPesticide: 'Release Trichogramma bactrae parasitoid egg cards @ 60,000/acre; spray Beauveria bassiana @ 5g/L.'
      },
      {
        name: 'Whiteflies & Aphids (Sucking Pests)',
        scientificName: 'Bemisia tabaci / Aphis gossypii',
        vulnerableStages: ['Seedling', 'Vegetative', 'Flowering'],
        tempRange: [25, 38],
        minHumidity: 40,
        maxHumidity: 75,
        rainSensitivity: 'drought_favoring',
        symptoms: 'Leaf curling, honey-dew deposition leading to black sooty mold; transmission of Cotton Leaf Curl Virus.',
        management: 'Yellow sticky traps (10/acre); spray Flonicamid 50 WG @ 0.3g/L or Diafenthiuron 50% WP @ 1.2g/L.',
        bioPesticide: 'Neem oil (10,000 ppm) @ 2ml/L or Verticillium lecanii @ 5g/L.'
      }
    ]
  },
  'Rice': {
    crop: 'Rice',
    pests: [
      {
        name: 'Brown Planthopper (BPH)',
        scientificName: 'Nilaparvata lugens',
        vulnerableStages: ['Vegetative', 'Flowering', 'Fruiting'],
        tempRange: [24, 32],
        minHumidity: 75,
        rainSensitivity: 'high',
        symptoms: 'Circular patches of drying plants called "hopper burn" in dense canopy fields.',
        management: 'Drain field water for 3-4 days to break humidity; spray Pymetrozine 50% WDG @ 0.6g/L directed at stem base.',
        bioPesticide: 'Metarhizium anisopliae bio-fungus @ 4g/L at base of hill.'
      },
      {
        name: 'Yellow Stem Borer',
        scientificName: 'Scirpophaga incertulas',
        vulnerableStages: ['Seedling', 'Vegetative', 'Flowering'],
        tempRange: [22, 30],
        minHumidity: 70,
        rainSensitivity: 'high',
        symptoms: '"Dead heart" in vegetative stage, and unfilled white ears ("white earhead") at panicle emergence.',
        management: 'Apply Chlorantraniliprole 0.4% G @ 4 kg/acre or Cartap hydrochloride 4G @ 7 kg/acre in standing water.',
        bioPesticide: 'Trichogramma japonicum egg parasitoids @ 20,000/acre; install light traps.'
      }
    ]
  },
  'Tomato': {
    crop: 'Tomato',
    pests: [
      {
        name: 'Tomato Leaf Miner / Pinworm',
        scientificName: 'Tuta absoluta',
        vulnerableStages: ['Vegetative', 'Flowering', 'Fruiting'],
        tempRange: [20, 32],
        minHumidity: 55,
        rainSensitivity: 'moderate',
        symptoms: 'Blotch-type translucent leaf mines, entry pinholes in green and ripe fruit causing rapid rot.',
        management: 'Install delta pheromone traps; spray Spinosad 45% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.4g/L.',
        bioPesticide: 'Bacillus thuringiensis (Bt kurstaki) @ 2g/L weekly.'
      },
      {
        name: 'Fruit Borer / American Bollworm',
        scientificName: 'Helicoverpa armigera',
        vulnerableStages: ['Flowering', 'Fruiting'],
        tempRange: [22, 35],
        minHumidity: 50,
        rainSensitivity: 'moderate',
        symptoms: 'Circular holes bored into fruits with larva feeding inside.',
        management: 'Spray Indoxacarb 14.5% SC @ 1ml/L or Novaluron 10% EC @ 1.5ml/L.',
        bioPesticide: 'Helicoverpa Nuclear Polyhedrosis Virus (HaNPV) @ 250 LE/ha with jaggery.'
      }
    ]
  },
  'Wheat': {
    crop: 'Wheat',
    pests: [
      {
        name: 'Wheat Aphid (Shoot Sucker)',
        scientificName: 'Rhopalosiphum padi / Sitobion avenae',
        vulnerableStages: ['Flowering', 'Fruiting', 'Maturity'],
        tempRange: [14, 25],
        minHumidity: 65,
        rainSensitivity: 'drought_favoring',
        symptoms: 'Colonies clustered on earheads and flag leaves, sapping sap and causing shriveled grain.',
        management: 'Spray Thiamethoxam 25% WG @ 0.2g/L or Dimethoate 30% EC @ 1.5ml/L when aphids exceed 10/earhead.',
        bioPesticide: 'Release Coccinella septempunctata (Ladybird beetles) predators.'
      }
    ]
  },
  'Corn (Maize)': {
    crop: 'Corn (Maize)',
    pests: [
      {
        name: 'Fall Armyworm (FAW)',
        scientificName: 'Spodoptera frugiperda',
        vulnerableStages: ['Seedling', 'Vegetative', 'Flowering'],
        tempRange: [22, 34],
        minHumidity: 60,
        rainSensitivity: 'high',
        symptoms: 'Severe windowing on young leaves and heavy saw-dust-like frass accumulated in the whorl.',
        management: 'Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L targeted directly into central whorls.',
        bioPesticide: 'Application of sand-lime mixture (9:1) into whorls, or Nomuraea rileyi bio-spray.'
      }
    ]
  },
  'Grapes': {
    crop: 'Grapes',
    pests: [
      {
        name: 'Thrips & Mealybugs',
        scientificName: 'Scirtothrips dorsalis / Maconellicoccus hirsutus',
        vulnerableStages: ['Flowering', 'Fruiting'],
        tempRange: [24, 36],
        minHumidity: 45,
        maxHumidity: 75,
        rainSensitivity: 'drought_favoring',
        symptoms: 'Scabby corky scarring on berries and white cottony wax clusters under vine bark.',
        management: 'Bark scrubbing, adhesive stem barriers; spray Spirotetramat 15.31% w/w OD @ 0.8ml/L.',
        bioPesticide: 'Cryptolaemus montrouzieri predatory grubs @ 300/acre.'
      }
    ]
  }
};

/**
 * Calculates pest risk score & level based on microclimate rules and crop vulnerability
 */
export function calculatePestRisk(
  cropType: string,
  growthStage: GrowthStage,
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    source: 'live_api' | 'manual';
    locationName: string;
    forecastCondition: string;
  },
  fieldId: string,
  fieldName: string
): PestRiskAssessment {
  // Normalize crop lookup
  const cropKey = Object.keys(PEST_DATABASE).find(k => k.toLowerCase() === cropType.toLowerCase()) || 'Cotton';
  const cropData = PEST_DATABASE[cropKey] || PEST_DATABASE['Cotton'];

  const { temperature: temp, humidity, rainfall, windSpeed } = weather;

  // Compute vulnerability index for each pest
  const identifiedPests: PestDetail[] = [];
  let highestPestRiskScore = 0;

  for (const pest of cropData.pests) {
    let pestScore = 20; // baseline endemic presence

    // 1. Stage vulnerability
    if (pest.vulnerableStages.includes(growthStage)) {
      pestScore += 35;
    } else {
      pestScore -= 10;
    }

    // 2. Temperature trigger
    if (temp >= pest.tempRange[0] && temp <= pest.tempRange[1]) {
      pestScore += 25;
    } else if (Math.abs(temp - pest.tempRange[0]) <= 3 || Math.abs(temp - pest.tempRange[1]) <= 3) {
      pestScore += 10;
    } else {
      pestScore -= 15;
    }

    // 3. Humidity & Moisture trigger
    if (humidity >= pest.minHumidity) {
      pestScore += 25;
      if (pest.maxHumidity && humidity > pest.maxHumidity) {
        pestScore -= 10; // e.g. dry loving whiteflies hate soaking rain
      }
    } else if (pest.rainSensitivity === 'drought_favoring' && humidity < 55) {
      pestScore += 20;
    }

    // 4. Rainfall trigger
    if (rainfall > 10 && pest.rainSensitivity === 'high') {
      pestScore += 15;
    } else if (rainfall > 25 && pest.rainSensitivity === 'drought_favoring') {
      pestScore -= 20; // heavy rain washes sucking nymphs
    }

    const clampedScore = Math.min(100, Math.max(10, pestScore));
    let threatLevel: PestRiskLevel = 'Low';
    if (clampedScore >= 68) threatLevel = 'High';
    else if (clampedScore >= 45) threatLevel = 'Medium';

    if (clampedScore > highestPestRiskScore) {
      highestPestRiskScore = clampedScore;
    }

    identifiedPests.push({
      name: pest.name,
      scientificName: pest.scientificName,
      threatLevel,
      symptoms: pest.symptoms,
      favorableConditions: `Temp: ${pest.tempRange[0]}-${pest.tempRange[1]}°C, Humidity: >${pest.minHumidity}%, Sensitivity: ${pest.rainSensitivity}`,
      management: pest.management,
      bioPesticide: pest.bioPesticide
    });
  }

  // Composite field risk score
  const finalRiskScore = highestPestRiskScore;
  let overallRiskLevel: PestRiskLevel = 'Low';
  if (finalRiskScore >= 68) overallRiskLevel = 'High';
  else if (finalRiskScore >= 45) overallRiskLevel = 'Medium';

  // Spray advisory window calculation
  const sprayAdvisory = evaluateSprayWindow(rainfall, windSpeed, humidity);

  // IPM Preventive advice
  const preventiveAdvice: string[] = [
    overallRiskLevel === 'High'
      ? `High pest pressure detected for ${cropType} in ${growthStage} stage. Deploy sticky/pheromone traps immediately.`
      : `Pest pressure is manageable. Maintain routine scouting at 10 crop stations.`,
    humidity > 75
      ? `High canopy humidity (${humidity}%) favors fungal sporulation. Avoid evening furrow flooding.`
      : `Low humidity slows fungal pathogens; monitor sucking insects instead.`,
    sprayAdvisory.safeToSpray
      ? `Weather window is clear for foliar applications today.`
      : `Postpone chemical spraying: ${sprayAdvisory.advice}`
  ];

  return {
    id: 'pest_' + Date.now(),
    fieldId,
    fieldName,
    timestamp: new Date().toISOString(),
    cropType,
    growthStage,
    weather,
    riskScore: finalRiskScore,
    riskLevel: overallRiskLevel,
    primaryPests: identifiedPests,
    sprayAdvisory,
    preventiveAdvice
  };
}

function evaluateSprayWindow(rainfall: number, windSpeed: number, humidity: number): SprayAdvisory {
  if (rainfall > 3) {
    return {
      safeToSpray: false,
      recommendedWindow: 'Hold spraying until rain halts and canopy dries',
      rainRisk: 'High rain wash-off risk',
      windSafety: `${windSpeed} km/h`,
      advice: 'Rainfall will wash away active chemical ingredients before cuticle absorption. Wait for dry leaf surface.'
    };
  }

  if (windSpeed > 18) {
    return {
      safeToSpray: false,
      recommendedWindow: 'Early morning (06:00 - 08:30) or late dusk',
      rainRisk: 'No wash-off',
      windSafety: `High wind drift (${windSpeed} km/h)`,
      advice: 'Excessive wind causes severe droplet drift, reducing target coverage and contaminating neighboring plots.'
    };
  }

  return {
    safeToSpray: true,
    recommendedWindow: 'Optimal: Today between 07:00 - 10:30 AM or 04:30 - 06:30 PM',
    rainRisk: 'Low (<1mm)',
    windSafety: `Ideal gentle breeze (${windSpeed} km/h)`,
    advice: 'Wind and humidity are favorable for fine droplet coverage and maximum biological uptake.'
  };
}
