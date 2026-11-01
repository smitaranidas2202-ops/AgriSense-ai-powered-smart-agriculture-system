export type Language = 'en' | 'hi' | 'mr';
export type PastelTheme = 'mint' | 'peach' | 'lavender' | 'sky';

export interface FarmerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  farmerIdNumber: string; // Kisan ID or Farmer Registry Number
  state: string;
  district: string;
  village?: string;
  totalAcres: number;
  primaryCrops: string[];
  preferredLanguage: Language;
  avatarUrl?: string;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  variety?: string;
  location: string;
  latitude: number;
  longitude: number;
  areaAcres: number;
  sowingDate: string;
  soilType: string;
}

export type IndianSoilCategory = 
  | 'Alluvial Soil'
  | 'Black Cotton Soil (Regur)'
  | 'Red and Yellow Soil'
  | 'Laterite Soil'
  | 'Arid / Desert Soil'
  | 'Saline & Alkaline Soil'
  | 'Peaty / Marshy Soil'
  | 'Mountain & Forest Soil';

export interface IndianSoilType {
  id: string;
  name: IndianSoilCategory;
  hindiName: string;
  marathiName: string;
  description: string;
  statesFound: string[];
  coveragePercentIndia: number;
  typicalN: number;
  typicalP: number;
  typicalK: number;
  typicalPh: number;
  typicalMoisture: number;
  texture: string;
  waterRetention: 'High' | 'Moderate' | 'Low';
  drainage: 'Well-drained' | 'Moderate' | 'Poor / Waterlogged' | 'Excessive';
  bestSuitedCrops: string[];
  soilHealthTips: string[];
  colorHex: string;
  badgeBg: string;
}

export type IndianCropCategory = 
  | 'Cereals & Millets'
  | 'Pulses'
  | 'Oilseeds'
  | 'Cash Crops & Fibers'
  | 'Horticulture & Fruits'
  | 'Vegetables & Spices'
  | 'Plantation';

export type IndianSeason = 'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)' | 'Perennial / Annual';

export interface IndianCropDetail {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  botanicalName: string;
  category: IndianCropCategory;
  season: IndianSeason;
  optimalN: number;
  optimalP: number;
  optimalK: number;
  optimalPh: [number, number];
  optimalTemp: [number, number];
  optimalMoisture: [number, number];
  waterDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  durationDays: string;
  majorProducingStates: string[];
  fertilizerPlan: string;
  keyPestsAndDiseases: string[];
  icon: string;
  imageUrl: string;
}

export type PathogenType = 'fungal' | 'bacterial' | 'viral' | 'pest' | 'healthy' | 'nutrient_deficiency';

export interface TopPrediction {
  diseaseName: string;
  score: number;
  crop: string;
}

export interface GradCamMetrics {
  lesionCoveragePct: number;
  primaryHotspot: { x: number; y: number };
  activationIntensity: number;
}

export interface LeafPrediction {
  id: string;
  fieldId: string;
  fieldName: string;
  timestamp: string;
  imageUrl: string;
  crop: string;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'High' | 'Severe';
  pathogenType: PathogenType;
  treatment: {
    chemical: string[];
    organic: string[];
    prevention: string[];
    urgency: 'Immediate' | 'Within 48h' | 'Routine' | 'None';
  };
  topPredictions: TopPrediction[];
  gradCamMetrics: GradCamMetrics;
}

export type FertilityClass = 'Very Poor' | 'Poor' | 'Moderate' | 'Good' | 'Optimal';

export interface RecommendedCrop {
  crop: string;
  matchScore: number; // 0-100
  reason: string;
  waterRequirement: string;
  season: string;
}

export interface FertilizerSuggestion {
  name: string;
  dosage: string;
  action: 'Add' | 'Maintain' | 'Reduce';
  reason: string;
}

export interface SoilReading {
  id: string;
  fieldId: string;
  fieldName: string;
  timestamp: string;
  source: 'manual' | 'csv' | 'iot';
  N: number; // kg/ha
  P: number; // kg/ha
  K: number; // kg/ha
  pH: number;
  moisture: number; // %
  temperature: number; // °C
  fertilityRating: number; // 0-100
  fertilityClass: FertilityClass;
  recommendedCrops: RecommendedCrop[];
  fertilizerSuggestions: FertilizerSuggestion[];
}

export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
export type PestRiskLevel = 'Low' | 'Medium' | 'High';

export interface PestDetail {
  name: string;
  scientificName: string;
  threatLevel: PestRiskLevel;
  symptoms: string;
  favorableConditions: string;
  management: string;
  bioPesticide: string;
}

export interface SprayAdvisory {
  safeToSpray: boolean;
  recommendedWindow: string;
  rainRisk: string;
  windSafety: string;
  advice: string;
}

export interface PestRiskAssessment {
  id: string;
  fieldId: string;
  fieldName: string;
  timestamp: string;
  cropType: string;
  growthStage: GrowthStage;
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    forecastCondition: string;
    source: 'live_api' | 'manual';
    locationName: string;
  };
  riskScore: number; // 0-100
  riskLevel: PestRiskLevel;
  primaryPests: PestDetail[];
  sprayAdvisory: SprayAdvisory;
  preventiveAdvice: string[];
}

export interface FarmAlert {
  id: string;
  fieldId: string;
  fieldName: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  module: 'crop' | 'soil' | 'pest' | 'iot';
  actionUrl?: string;
}

export interface IoTTelemetry {
  nodeId: string;
  nodeName: string;
  batteryPct: number;
  signalDbm: number;
  status: 'online' | 'transmitting' | 'standby' | 'offline';
  lastPing: string;
  readings: {
    N: number;
    P: number;
    K: number;
    moisture: number;
    temperature: number;
    pH: number;
  };
  packetCount: number;
}

export interface FarmHealthIndex {
  overallScore: number; // 0-100
  cropHealthScore: number; // 0-100
  soilFertilityScore: number; // 0-100
  pestSafetyScore: number; // 0-100
  status: 'Thriving' | 'Good' | 'Attention Needed' | 'Critical Risk';
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    text: string;
    module: 'crop' | 'soil' | 'pest';
  }[];
}
