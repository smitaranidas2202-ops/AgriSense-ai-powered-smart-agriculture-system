import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Save, 
  MapPin, 
  Sliders,
  Calendar
} from 'lucide-react';
import { Field, GrowthStage, Language, PestRiskAssessment, PestRiskLevel } from '../types';
import { translations } from '../i18n/translations';
import { calculatePestRisk } from '../utils/pestModel';
import { fetchLiveWeather, POPULAR_FARMING_REGIONS, WeatherResult } from '../utils/weatherApi';

interface PestRiskModuleProps {
  lang: Language;
  activeField: Field;
  onSaveAssessment: (assessment: PestRiskAssessment) => void;
}

export const PestRiskModule: React.FC<PestRiskModuleProps> = ({
  lang,
  activeField,
  onSaveAssessment,
}) => {
  const t = translations[lang];

  // Weather state
  const [selectedRegion, setSelectedRegion] = useState<string>(POPULAR_FARMING_REGIONS[0].name);
  const [temp, setTemp] = useState<number>(28);
  const [humidity, setHumidity] = useState<number>(76);
  const [rainfall, setRainfall] = useState<number>(3.5);
  const [windSpeed, setWindSpeed] = useState<number>(11);
  const [weatherCondition, setWeatherCondition] = useState<string>('Humid & Warm');
  const [weatherSource, setWeatherSource] = useState<'live_api' | 'manual'>('live_api');
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Agronomic parameters
  const [cropType, setCropType] = useState<string>(activeField.cropType || 'Tomato');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync cropType when activeField changes
  useEffect(() => {
    if (activeField.cropType) {
      setCropType(activeField.cropType);
    }
  }, [activeField]);

  // Initial live weather fetch on load
  useEffect(() => {
    handleFetchWeather();
  }, [selectedRegion]);

  const handleFetchWeather = async () => {
    setIsLoadingWeather(true);
    const region = POPULAR_FARMING_REGIONS.find(r => r.name === selectedRegion) || POPULAR_FARMING_REGIONS[0];
    try {
      const res = await fetchLiveWeather(region.lat, region.lon, region.name);
      setTemp(res.temperature);
      setHumidity(res.humidity);
      setRainfall(res.rainfall);
      setWindSpeed(res.windSpeed);
      setWeatherCondition(res.weatherCondition);
      setWeatherSource('live_api');
    } catch (err) {
      console.warn('Weather error', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Run dynamic calculation
  const assessment = calculatePestRisk(
    cropType,
    growthStage,
    {
      temperature: temp,
      humidity,
      rainfall,
      windSpeed,
      source: weatherSource,
      locationName: selectedRegion,
      forecastCondition: weatherCondition
    },
    activeField.id,
    activeField.name
  );

  const handleSave = () => {
    onSaveAssessment(assessment);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getRiskColor = (level: PestRiskLevel) => {
    if (level === 'High') return 'bg-[#fdeeed] text-[#b42b30] border-[#f8c6c8]';
    if (level === 'Medium') return 'bg-[#fef4e8] text-[#9c5415] border-[#fed9b3]';
    return 'bg-[#e6f4ec] text-[#1b5e37] border-[#bce2cb]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Module 3: Entomological Outbreak & Weather Risk Engine</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-1">
              {t.pestModule.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {t.pestModule.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Field Target:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              {activeField.name} ({activeField.cropType})
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Weather & Phenology Inputs (Left) vs Risk & Pests (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Environmental & Crop Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Weather Location Selector & Live Fetch */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Live Microclimate Weather
              </h3>
              <button
                onClick={handleFetchWeather}
                disabled={isLoadingWeather}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#16271e] text-emerald-300 border border-emerald-800 hover:bg-emerald-900/50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                {t.pestModule.fetchLiveWeather}
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {t.pestModule.locationLabel}
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                {POPULAR_FARMING_REGIONS.map((r, i) => (
                  <option key={i} value={r.name} className="bg-[#111e16] text-slate-200">
                    {r.name} - {r.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Weather Gauges Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Temperature */}
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    {t.pestModule.temp}
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={temp}
                  onChange={(e) => { setTemp(parseInt(e.target.value)); setWeatherSource('manual'); }}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Humidity */}
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    {t.pestModule.humidity}
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="98"
                  value={humidity}
                  onChange={(e) => { setHumidity(parseInt(e.target.value)); setWeatherSource('manual'); }}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Rainfall */}
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                    {t.pestModule.rainfall}
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.5"
                  value={rainfall}
                  onChange={(e) => { setRainfall(parseFloat(e.target.value)); setWeatherSource('manual'); }}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Wind Speed */}
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                    {t.pestModule.wind}
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={windSpeed}
                  onChange={(e) => { setWindSpeed(parseInt(e.target.value)); setWeatherSource('manual'); }}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Sky Condition: <strong className="text-slate-300">{weatherCondition}</strong></span>
              <span className="font-mono text-[10px] text-emerald-400">
                {weatherSource === 'live_api' ? '● Open-Meteo Synced' : '● What-If Adjusted'}
              </span>
            </div>
          </div>

          {/* Crop & Phenology Stage Form */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-900/40 pb-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Crop Type & Phenology Stage
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Host Crop Species</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                <option value="Rice">Rice (Oryza sativa)</option>
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Wheat">Wheat (Triticum aestivum)</option>
                <option value="Corn (Maize)">Corn / Maize (Zea mays)</option>
                <option value="Grapes">Grapes (Vitis vinifera)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                {t.pestModule.cropStageLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'] as GrowthStage[]).map((stage) => {
                  const isSelected = growthStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => setGrowthStage(stage)}
                      className={`py-2 px-2 rounded-xl text-center font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                          : 'bg-[#14231b] text-slate-400 hover:text-slate-200 border border-emerald-900/50'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Outbreak Risk Gauges & Pest Action Plan */}
        <div className="lg:col-span-7 space-y-5">
          {/* Outbreak Risk Composite Badge */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/40 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                  {t.pestModule.overallRisk}
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-black text-slate-100 font-mono">
                    {assessment.riskScore}/100
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(assessment.riskLevel)}`}>
                    {assessment.riskLevel} Pest Risk
                  </span>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={savedSuccess}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved to Alerts & History!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Assessment
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {t.pestModule.riskScoreDesc}
            </p>

            {/* Risk Gauge Bar */}
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  assessment.riskLevel === 'High' ? 'bg-gradient-to-r from-amber-500 to-rose-600' :
                  assessment.riskLevel === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                  'bg-gradient-to-r from-emerald-500 to-green-400'
                }`}
                style={{ width: `${assessment.riskScore}%` }}
              />
            </div>
          </div>

          {/* Spray Advisory Window */}
          <div className={`rounded-2xl p-5 border shadow-lg ${
            assessment.sprayAdvisory.safeToSpray 
              ? 'bg-[#111e16] border-emerald-800/70' 
              : 'bg-[#1e1414] border-rose-900/60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${assessment.sprayAdvisory.safeToSpray ? 'text-emerald-400' : 'text-rose-400'}`} />
                {t.pestModule.sprayAdvisoryTitle}
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                assessment.sprayAdvisory.safeToSpray 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}>
                {assessment.sprayAdvisory.safeToSpray ? 'Safe to Spray' : 'Postpone Spraying'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {assessment.sprayAdvisory.advice}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block">Recommended Window</span>
                <span className="font-semibold text-slate-200">{assessment.sprayAdvisory.recommendedWindow}</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block">Rain Wash-off Risk</span>
                <span className="font-semibold text-slate-200">{assessment.sprayAdvisory.rainRisk}</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block">Drift & Wind Safety</span>
                <span className="font-semibold text-slate-200">{assessment.sprayAdvisory.windSafety}</span>
              </div>
            </div>
          </div>

          {/* High Probability Pests Breakdown */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Bug className="w-4 h-4 text-emerald-400" />
              {t.pestModule.vulnerablePests} ({cropType})
            </h3>

            <div className="space-y-3 pt-1">
              {assessment.primaryPests.map((pest, idx) => (
                <div 
                  key={idx}
                  className="bg-[#14231b] border border-emerald-900/50 rounded-xl p-4 space-y-2.5 hover:border-emerald-700/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        {pest.name}
                        <span className="text-[11px] font-mono text-slate-400 font-normal italic">
                          ({pest.scientificName})
                        </span>
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskColor(pest.threatLevel)}`}>
                      {pest.threatLevel} Threat
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400">Symptoms:</strong> {pest.symptoms}
                  </p>

                  <div className="text-[11px] bg-black/25 p-2 rounded-lg border border-white/5 text-slate-300">
                    <span className="text-emerald-400 font-semibold block mb-0.5">Recommended Management:</span>
                    {pest.management}
                  </div>

                  <div className="text-[11px] bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/40 text-emerald-300">
                    <span className="text-green-400 font-semibold block mb-0.5">Bio-Control & Parasitoids:</span>
                    {pest.bioPesticide}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Pest Management (IPM) Protocols */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-2.5 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200">
              {t.pestModule.preventiveAdviceTitle}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {assessment.preventiveAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#14231b] p-2.5 rounded-xl border border-emerald-900/40">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
