import { FarmAlert, FarmHealthIndex, FarmerUser, Field, IoTTelemetry, LeafPrediction, PestRiskAssessment, SoilReading } from '../types';
import { calculateFertilityRating, recommendCrops, generateFertilizerPrescription } from './soilModel';
import { calculatePestRisk } from './pestModel';

const STORAGE_KEYS = {
  FIELDS: 'agrisense_fields_v1',
  ACTIVE_FIELD: 'agrisense_active_field_v1',
  LEAF_PREDICTIONS: 'agrisense_leaf_preds_v1',
  SOIL_READINGS: 'agrisense_soil_readings_v1',
  PEST_ASSESSMENTS: 'agrisense_pest_assessments_v1',
  ALERTS: 'agrisense_alerts_v1',
  IOT_STATE: 'agrisense_iot_state_v1',
  LANG: 'agrisense_lang_v1',
  CURRENT_FARMER: 'agrisense_current_farmer_v1',
  REGISTERED_FARMERS: 'agrisense_registered_farmers_v1',
  PASTEL_THEME: 'agrisense_pastel_theme_v1',
};

export function getStoredPastelTheme(): import('../types').PastelTheme {
  const t = localStorage.getItem(STORAGE_KEYS.PASTEL_THEME);
  if (t === 'peach' || t === 'lavender' || t === 'sky' || t === 'mint') {
    return t;
  }
  return 'mint';
}

export function setStoredPastelTheme(theme: import('../types').PastelTheme): void {
  localStorage.setItem(STORAGE_KEYS.PASTEL_THEME, theme);
}

export const DEMO_FARMERS: FarmerUser[] = [
  {
    id: 'farmer_1',
    name: 'Ramesh Patil',
    phone: '9822012345',
    email: 'ramesh.patil@kisan.in',
    farmerIdNumber: 'MH-NSK-2026-8841',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Ozar Agriland',
    totalAcres: 12.5,
    primaryCrops: ['Grapes', 'Tomato', 'Onion'],
    preferredLanguage: 'mr',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-15'
  },
  {
    id: 'farmer_2',
    name: 'Sukhwinder Singh',
    phone: '9814056789',
    email: 'sukhwinder.farm@kisan.in',
    farmerIdNumber: 'PB-LDH-2026-3392',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samrala Kalan',
    totalAcres: 24.0,
    primaryCrops: ['Wheat', 'Rice (Basmati)', 'Mustard'],
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-02-10'
  },
  {
    id: 'farmer_3',
    name: 'Anita Deshmukh',
    phone: '9890123456',
    email: 'anita.deshmukh@kisan.in',
    farmerIdNumber: 'MH-NGP-2026-5510',
    state: 'Maharashtra',
    district: 'Nagpur',
    village: 'Katol Agro-Belt',
    totalAcres: 8.5,
    primaryCrops: ['Cotton', 'Soybean', 'Orange'],
    preferredLanguage: 'mr',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-03-05'
  }
];

export function getRegisteredFarmers(): FarmerUser[] {
  const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_FARMERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_FARMERS, JSON.stringify(DEMO_FARMERS));
    return DEMO_FARMERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEMO_FARMERS;
  }
}

export function getCurrentFarmer(): FarmerUser | null {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_FARMER);
  if (!raw) {
    // Default to first demo farmer so app is immediately personalized, but allows switching/logging out
    localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(DEMO_FARMERS[0]));
    return DEMO_FARMERS[0];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEMO_FARMERS[0];
  }
}

export function setCurrentFarmer(farmer: FarmerUser | null): void {
  if (farmer) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(farmer));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_FARMER);
  }
}

export function registerFarmer(newFarmer: FarmerUser): void {
  const list = getRegisteredFarmers();
  const existingIdx = list.findIndex(f => f.phone === newFarmer.phone || f.id === newFarmer.id);
  if (existingIdx >= 0) {
    list[existingIdx] = newFarmer;
  } else {
    list.push(newFarmer);
  }
  localStorage.setItem(STORAGE_KEYS.REGISTERED_FARMERS, JSON.stringify(list));
  setCurrentFarmer(newFarmer);
}

export function updateFarmerProfile(updated: FarmerUser): void {
  registerFarmer(updated);
}

export const INITIAL_FIELDS: Field[] = [
  {
    id: 'field_1',
    name: 'North Acre Plot',
    cropType: 'Tomato',
    variety: 'Abhinav Hybrid F1',
    location: 'Nashik, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    areaAcres: 3.5,
    sowingDate: '2026-09-15',
    soilType: 'Black Clay Loam'
  },
  {
    id: 'field_2',
    name: 'East Cotton Sector',
    cropType: 'Cotton',
    variety: 'Bt Cotton RCH-659',
    location: 'Nagpur, Maharashtra',
    latitude: 21.1458,
    longitude: 79.0882,
    areaAcres: 8.0,
    sowingDate: '2026-08-10',
    soilType: 'Medium Deep Vertisol'
  },
  {
    id: 'field_3',
    name: 'South Vineyard',
    cropType: 'Grapes',
    variety: 'Thompson Seedless',
    location: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    areaAcres: 4.2,
    sowingDate: '2025-11-20',
    soilType: 'Red Loamy Well-drained'
  }
];

export const INITIAL_ALERTS: FarmAlert[] = [
  {
    id: 'alt_1',
    fieldId: 'field_1',
    fieldName: 'North Acre Plot',
    title: 'High Pest Risk: Spodoptera Alert',
    message: 'High humidity (>78%) combined with 28°C ambient temperature elevates Tomato Pinworm and fungal sporulation risk over the next 3 days.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    read: false,
    module: 'pest'
  },
  {
    id: 'alt_2',
    fieldId: 'field_1',
    fieldName: 'North Acre Plot',
    title: 'Early Blight Detected on Lower Canopy',
    message: 'Target-board necrotic rings identified with 96.4% confidence via MobileNetV2 Grad-CAM. Foliar Mancozeb spray recommended.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false,
    module: 'crop'
  },
  {
    id: 'alt_3',
    fieldId: 'field_2',
    fieldName: 'East Cotton Sector',
    title: 'Nitrogen Deficiency in Topsoil',
    message: 'Soil reading (48 kg/ha N) is below threshold of 90 kg/ha. Apply 35 kg/ha Urea split dose.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    read: false,
    module: 'soil'
  },
  {
    id: 'alt_4',
    fieldId: 'field_1',
    fieldName: 'North Acre Plot',
    title: 'IoT Sensor Node-01 Online',
    message: 'Telemetry synchronized via LoRa gateway; 5-parameter soil probe reports 58% moisture.',
    severity: 'info',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    read: true,
    module: 'iot'
  }
];

export function getStoredFields(): Field[] {
  const raw = localStorage.getItem(STORAGE_KEYS.FIELDS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(INITIAL_FIELDS));
    return INITIAL_FIELDS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_FIELDS;
  }
}

export function saveField(field: Field) {
  const fields = getStoredFields();
  const existingIdx = fields.findIndex(f => f.id === field.id);
  if (existingIdx >= 0) {
    fields[existingIdx] = field;
  } else {
    fields.push(field);
  }
  localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
}

export function getActiveFieldId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_FIELD) || INITIAL_FIELDS[0].id;
}

export function setActiveFieldId(id: string) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_FIELD, id);
}

export function getStoredAlerts(): FarmAlert[] {
  const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
    return INITIAL_ALERTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALERTS;
  }
}

export function addAlert(alert: FarmAlert) {
  const list = getStoredAlerts();
  list.unshift(alert);
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(list.slice(0, 30)));
}

export function markAlertRead(alertId: string) {
  const list = getStoredAlerts();
  const target = list.find(a => a.id === alertId);
  if (target) {
    target.read = true;
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(list));
  }
}

export function getStoredLeafPredictions(fieldId?: string): LeafPrediction[] {
  const raw = localStorage.getItem(STORAGE_KEYS.LEAF_PREDICTIONS);
  let list: LeafPrediction[] = [];
  if (raw) {
    try {
      list = JSON.parse(raw);
    } catch {
      list = [];
    }
  }

  // Pre-seed if empty
  if (list.length === 0) {
    list = [
      {
        id: 'seed_leaf_1',
        fieldId: 'field_1',
        fieldName: 'North Acre Plot',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
        crop: 'Tomato',
        diseaseName: 'Tomato Early Blight',
        scientificName: 'Alternaria solani',
        confidence: 0.964,
        severity: 'High',
        pathogenType: 'fungal',
        treatment: {
          urgency: 'Immediate',
          chemical: ['Apply Chlorothalonil 75 WP @ 2g/L water', 'Mancozeb 75 WP @ 2.5g/L'],
          organic: ['Trichoderma harzianum @ 5g/L foliar spray', 'Neem seed kernel extract 5%'],
          prevention: ['Stake vines above wet ground', 'Adopt drip lines instead of overhead sprinklers']
        },
        topPredictions: [
          { diseaseName: 'Tomato Early Blight', score: 0.964, crop: 'Tomato' },
          { diseaseName: 'Tomato Septoria Leaf Spot', score: 0.024, crop: 'Tomato' },
          { diseaseName: 'Potato Late Blight', score: 0.008, crop: 'Potato' },
          { diseaseName: 'Healthy Crop Leaf', score: 0.004, crop: 'Wheat' }
        ],
        gradCamMetrics: {
          lesionCoveragePct: 24,
          primaryHotspot: { x: 0.42, y: 0.38 },
          activationIntensity: 96
        }
      }
    ];
    localStorage.setItem(STORAGE_KEYS.LEAF_PREDICTIONS, JSON.stringify(list));
  }

  if (fieldId) {
    return list.filter(item => item.fieldId === fieldId);
  }
  return list;
}

export function saveLeafPrediction(pred: LeafPrediction) {
  const list = getStoredLeafPredictions();
  list.unshift(pred);
  localStorage.setItem(STORAGE_KEYS.LEAF_PREDICTIONS, JSON.stringify(list.slice(0, 40)));

  // If severe or high disease, auto-create alert
  if (pred.severity === 'Severe' || pred.severity === 'High') {
    addAlert({
      id: 'alt_' + Date.now(),
      fieldId: pred.fieldId,
      fieldName: pred.fieldName,
      title: `Pathogen Alert: ${pred.diseaseName}`,
      message: `Detected with ${(pred.confidence * 100).toFixed(1)}% confidence. Urgency: ${pred.treatment.urgency}. Grad-CAM shows ${pred.gradCamMetrics.lesionCoveragePct}% lesion coverage.`,
      severity: pred.severity === 'Severe' ? 'critical' : 'warning',
      timestamp: new Date().toISOString(),
      read: false,
      module: 'crop'
    });
  }
}

export function getStoredSoilReadings(fieldId?: string): SoilReading[] {
  const raw = localStorage.getItem(STORAGE_KEYS.SOIL_READINGS);
  let list: SoilReading[] = [];
  if (raw) {
    try {
      list = JSON.parse(raw);
    } catch {
      list = [];
    }
  }

  if (list.length === 0) {
    const fert = calculateFertilityRating(78, 45, 40, 6.4, 58);
    const recCrops = recommendCrops(78, 45, 40, 6.4, 27, 58);
    const fertSugg = generateFertilizerPrescription(78, 45, 40, 6.4, 'Tomato');
    list = [
      {
        id: 'seed_soil_1',
        fieldId: 'field_1',
        fieldName: 'North Acre Plot',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        source: 'iot',
        N: 78,
        P: 45,
        K: 40,
        pH: 6.4,
        moisture: 58,
        temperature: 26.5,
        fertilityRating: fert.score,
        fertilityClass: fert.classification,
        recommendedCrops: recCrops,
        fertilizerSuggestions: fertSugg
      }
    ];
    localStorage.setItem(STORAGE_KEYS.SOIL_READINGS, JSON.stringify(list));
  }

  if (fieldId) {
    return list.filter(item => item.fieldId === fieldId);
  }
  return list;
}

export function saveSoilReading(reading: SoilReading) {
  const list = getStoredSoilReadings();
  list.unshift(reading);
  localStorage.setItem(STORAGE_KEYS.SOIL_READINGS, JSON.stringify(list.slice(0, 40)));

  if (reading.fertilityRating < 45 || reading.pH < 5.5 || reading.pH > 8.2) {
    addAlert({
      id: 'alt_' + Date.now(),
      fieldId: reading.fieldId,
      fieldName: reading.fieldName,
      title: `Suboptimal Soil Quality (${reading.fertilityRating}%)`,
      message: `Nutrient balance requires immediate fertilizer intervention. pH is ${reading.pH.toFixed(1)}, N is ${reading.N} kg/ha.`,
      severity: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
      module: 'soil'
    });
  }
}

export function getStoredPestAssessments(fieldId?: string): PestRiskAssessment[] {
  const raw = localStorage.getItem(STORAGE_KEYS.PEST_ASSESSMENTS);
  let list: PestRiskAssessment[] = [];
  if (raw) {
    try {
      list = JSON.parse(raw);
    } catch {
      list = [];
    }
  }

  if (list.length === 0) {
    const initRisk = calculatePestRisk(
      'Tomato',
      'Vegetative',
      {
        temperature: 28,
        humidity: 78,
        rainfall: 4.2,
        windSpeed: 10,
        forecastCondition: 'Warm & Humid',
        source: 'live_api',
        locationName: 'Nashik, Maharashtra'
      },
      'field_1',
      'North Acre Plot'
    );
    list = [initRisk];
    localStorage.setItem(STORAGE_KEYS.PEST_ASSESSMENTS, JSON.stringify(list));
  }

  if (fieldId) {
    return list.filter(item => item.fieldId === fieldId);
  }
  return list;
}

export function savePestAssessment(assessment: PestRiskAssessment) {
  const list = getStoredPestAssessments();
  list.unshift(assessment);
  localStorage.setItem(STORAGE_KEYS.PEST_ASSESSMENTS, JSON.stringify(list.slice(0, 40)));

  if (assessment.riskLevel === 'High') {
    addAlert({
      id: 'alt_' + Date.now(),
      fieldId: assessment.fieldId,
      fieldName: assessment.fieldName,
      title: `High Pest Pressure Alert for ${assessment.cropType}`,
      message: `Risk score elevated to ${assessment.riskScore}%. Favorable weather triggers pest proliferation. Check IPM recommendations.`,
      severity: 'critical',
      timestamp: new Date().toISOString(),
      read: false,
      module: 'pest'
    });
  }
}

/**
 * Synthesizes the Combined Farm Health Index (0-100)
 */
export function calculateFarmHealthIndex(fieldId: string): FarmHealthIndex {
  const leaves = getStoredLeafPredictions(fieldId);
  const soils = getStoredSoilReadings(fieldId);
  const pests = getStoredPestAssessments(fieldId);

  // 1. Crop Health component (0 - 100)
  let cropScore = 88;
  if (leaves.length > 0) {
    const latest = leaves[0];
    if (latest.pathogenType === 'healthy') {
      cropScore = 96;
    } else if (latest.severity === 'Severe') {
      cropScore = 35;
    } else if (latest.severity === 'High') {
      cropScore = 52;
    } else if (latest.severity === 'Moderate') {
      cropScore = 70;
    } else {
      cropScore = 82;
    }
  }

  // 2. Soil Fertility component (0 - 100)
  let soilScore = 76;
  if (soils.length > 0) {
    soilScore = soils[0].fertilityRating;
  }

  // 3. Pest Safety Margin (0 - 100)
  let pestSafetyScore = 80;
  if (pests.length > 0) {
    const latestPest = pests[0];
    pestSafetyScore = Math.max(10, 100 - latestPest.riskScore);
  }

  // Combined weighted score: Crop Health 35%, Soil 35%, Pest Safety 30%
  const overallScore = Math.round(cropScore * 0.35 + soilScore * 0.35 + pestSafetyScore * 0.30);

  let status: 'Thriving' | 'Good' | 'Attention Needed' | 'Critical Risk' = 'Good';
  if (overallScore >= 82) status = 'Thriving';
  else if (overallScore >= 68) status = 'Good';
  else if (overallScore >= 48) status = 'Attention Needed';
  else status = 'Critical Risk';

  // Action items prioritization
  const actionItems: { priority: 'high' | 'medium' | 'low'; text: string; module: 'crop' | 'soil' | 'pest' }[] = [];

  if (leaves.length > 0 && leaves[0].severity !== 'Healthy') {
    actionItems.push({
      priority: leaves[0].severity === 'Severe' || leaves[0].severity === 'High' ? 'high' : 'medium',
      text: `Remediate ${leaves[0].diseaseName}: ${leaves[0].treatment.chemical[0] || 'Apply targeted bio-fungicide'}`,
      module: 'crop'
    });
  }

  if (soils.length > 0) {
    const s = soils[0];
    if (s.N < 60) {
      actionItems.push({
        priority: 'high',
        text: `Nitrogen deficit (${s.N} kg/ha): Apply Urea top-dressing`,
        module: 'soil'
      });
    }
    if (s.pH < 5.8) {
      actionItems.push({
        priority: 'medium',
        text: `Acidic soil (pH ${s.pH.toFixed(1)}): Apply Agricultural Lime (CaCO3)`,
        module: 'soil'
      });
    }
  }

  if (pests.length > 0 && pests[0].riskLevel === 'High') {
    actionItems.push({
      priority: 'high',
      text: `High Pest Warning: Install delta/pheromone traps and prepare spray window`,
      module: 'pest'
    });
  }

  if (actionItems.length === 0) {
    actionItems.push({
      priority: 'low',
      text: 'Routine field maintenance; soil moisture and foliage indices optimal',
      module: 'crop'
    });
  }

  return {
    overallScore,
    cropHealthScore: cropScore,
    soilFertilityScore: soilScore,
    pestSafetyScore,
    status,
    actionItems
  };
}
