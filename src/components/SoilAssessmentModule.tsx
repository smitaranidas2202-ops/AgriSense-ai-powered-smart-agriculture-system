import React, { useState } from 'react';
import { 
  Layers, 
  Upload, 
  Radio, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  FileSpreadsheet, 
  Droplets, 
  Thermometer, 
  Beaker, 
  TrendingUp, 
  Wheat,
  Info
} from 'lucide-react';
import { Field, Language, SoilReading } from '../types';
import { translations } from '../i18n/translations';
import { 
  calculateFertilityRating, 
  evaluateNutrients, 
  generateFertilizerPrescription, 
  generateSampleCsvContent, 
  parseSoilCsv, 
  recommendCrops 
} from '../utils/soilModel';

import { INDIAN_CROPS_DATABASE, INDIAN_SOIL_TYPES, SHC_GOVT_STANDARDS } from '../utils/indianAgriData';

interface SoilAssessmentModuleProps {
  lang: Language;
  activeField: Field;
  onSaveReading: (reading: SoilReading) => void;
  latestIoTData: {
    N: number;
    P: number;
    K: number;
    pH: number;
    moisture: number;
    temperature: number;
  } | null;
  isIoTRunning: boolean;
  preselectedSoilPresetId?: string;
  preselectedCrop?: string;
}

export const SoilAssessmentModule: React.FC<SoilAssessmentModuleProps> = ({
  lang,
  activeField,
  onSaveReading,
  latestIoTData,
  isIoTRunning,
  preselectedSoilPresetId,
  preselectedCrop,
}) => {
  const t = translations[lang];

  // Nutrient inputs
  const [n, setN] = useState<number>(78);
  const [p, setP] = useState<number>(45);
  const [k, setK] = useState<number>(42);
  const [ph, setPh] = useState<number>(6.5);
  const [moisture, setMoisture] = useState<number>(56);
  const [temperature, setTemperature] = useState<number>(26.5);
  const [inputMode, setInputMode] = useState<'manual' | 'csv' | 'iot'>('manual');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [csvFileName, setCsvFileName] = useState<string>('');

  // Indian Agronomic Extensions
  const [selectedSoilId, setSelectedSoilId] = useState<string>(preselectedSoilPresetId || 'soil_black_cotton');
  const [targetCrop, setTargetCrop] = useState<string>(preselectedCrop || activeField.cropType || 'Tomato');
  const [shcView, setShcView] = useState<boolean>(false);

  // Sync external preselected props if they change
  React.useEffect(() => {
    if (preselectedSoilPresetId) {
      handleSelectIcarSoil(preselectedSoilPresetId);
    }
  }, [preselectedSoilPresetId]);

  React.useEffect(() => {
    if (preselectedCrop) {
      setTargetCrop(preselectedCrop);
    }
  }, [preselectedCrop]);

  const handleSelectIcarSoil = (soilId: string) => {
    const soil = INDIAN_SOIL_TYPES.find(s => s.id === soilId);
    if (soil) {
      setSelectedSoilId(soilId);
      setN(soil.typicalN);
      setP(soil.typicalP);
      setK(soil.typicalK);
      setPh(soil.typicalPh);
      setMoisture(soil.typicalMoisture);
    }
  };

  // Calculations
  const fertility = calculateFertilityRating(n, p, k, ph, moisture);
  const nutrientBreakdown = evaluateNutrients(n, p, k, ph, moisture);
  const recommendedCrops = recommendCrops(n, p, k, ph, temperature, moisture);
  const fertilizerPrescription = generateFertilizerPrescription(n, p, k, ph, targetCrop);
  const activeSoilInfo = INDIAN_SOIL_TYPES.find(s => s.id === selectedSoilId) || INDIAN_SOIL_TYPES[1];

  const handleSyncIoT = () => {
    if (latestIoTData) {
      setN(latestIoTData.N);
      setP(latestIoTData.P);
      setK(latestIoTData.K);
      setPh(latestIoTData.pH);
      setMoisture(latestIoTData.moisture);
      setTemperature(latestIoTData.temperature);
      setInputMode('iot');
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseSoilCsv(text);
        if (parsed) {
          setN(parsed.n);
          setP(parsed.p);
          setK(parsed.k);
          setPh(parsed.ph);
          setMoisture(parsed.moisture);
          setTemperature(parsed.temp);
          setInputMode('csv');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSampleCsv = () => {
    const content = generateSampleCsvContent();
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_soil_reading_agrisense.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveRecord = () => {
    const reading: SoilReading = {
      id: 'soil_' + Date.now(),
      fieldId: activeField.id,
      fieldName: activeField.name,
      timestamp: new Date().toISOString(),
      source: inputMode,
      N: n,
      P: p,
      K: k,
      pH: ph,
      moisture,
      temperature,
      fertilityRating: fertility.score,
      fertilityClass: fertility.classification,
      recommendedCrops,
      fertilizerSuggestions: fertilizerPrescription
    };
    onSaveReading(reading);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getFertilityBadgeColor = (cls: string) => {
    if (cls === 'Optimal') return 'bg-[#e6f4ec] text-[#1b5e37] border-[#bce2cb]';
    if (cls === 'Good') return 'bg-[#eaf5ed] text-[#246b3f] border-[#c0e4cd]';
    if (cls === 'Moderate') return 'bg-[#fef4e8] text-[#9c5415] border-[#fed9b3]';
    return 'bg-[#fdeeed] text-[#b42b30] border-[#f8c6c8]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Module 2: Pedology & Fertility Optimization</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-1">
              {t.soilModule.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {t.soilModule.subtitle}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#14231b] border border-emerald-900/70 p-1 rounded-xl text-xs gap-1">
            <button
              onClick={() => setInputMode('manual')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                inputMode === 'manual'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.soilModule.manualTab}
            </button>
            <button
              onClick={() => setInputMode('csv')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                inputMode === 'csv'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.soilModule.csvTab}
            </button>
            <button
              onClick={handleSyncIoT}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                inputMode === 'iot'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isIoTRunning ? 'text-emerald-400' : ''}`} />
              {t.soilModule.iotTab}
            </button>
          </div>
        </div>
      </div>

      {/* ICAR Indian Soils 1-Click Auto-Fill Bar */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4 space-y-2.5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              ICAR 8 Indian Soil Orders (1-Click Auto-Fill)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Target Indian Crop:</span>
            <select
              value={targetCrop}
              onChange={(e) => setTargetCrop(e.target.value)}
              className="bg-[#14231b] text-emerald-300 border border-emerald-800 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {INDIAN_CROPS_DATABASE.map(c => (
                <option key={c.id} value={c.name} className="bg-[#111e16] text-slate-200">
                  {c.icon} {c.name} ({lang === 'hi' ? c.hindiName : lang === 'mr' ? c.marathiName : c.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {INDIAN_SOIL_TYPES.map(soil => {
            const isSelected = selectedSoilId === soil.id;
            return (
              <button
                key={soil.id}
                onClick={() => handleSelectIcarSoil(soil.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950 ring-1 ring-emerald-400'
                    : 'bg-[#14261c] text-slate-300 hover:text-white border border-emerald-900/60 hover:border-emerald-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: soil.colorHex }} />
                <span>{soil.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 hidden md:inline">({soil.hindiName.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Soil ICAR Callout */}
        <div className="bg-[#14261c] border border-emerald-900/50 p-2.5 rounded-xl flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-300">{activeSoilInfo.name}</span>
            <span className="text-slate-400 font-devanagari">({activeSoilInfo.hindiName} / {activeSoilInfo.marathiName})</span>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-slate-300 font-mono">
              Texture: {activeSoilInfo.texture}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Found in: {activeSoilInfo.statesFound.slice(0, 4).join(', ')}
          </span>
        </div>
      </div>

      {/* CSV Dropzone / IoT Sync Callout if active */}
      {inputMode === 'csv' && (
        <div className="bg-[#111e16] border border-emerald-800/60 rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Upload Soil Sensor / Lab Testing CSV
              </h3>
              <p className="text-xs text-slate-400">
                Supports columns: nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha, soil_ph, moisture_pct, temperature_c
              </p>
            </div>
            <button
              onClick={handleDownloadSampleCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#16271e] border border-emerald-900/80 text-emerald-300 hover:bg-emerald-950"
            >
              <Download className="w-3.5 h-3.5" />
              {t.soilModule.csvTemplateDownload}
            </button>
          </div>

          <label className="border-2 border-dashed border-emerald-700/50 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-[#122218]/40 hover:bg-[#122218] transition-all">
            <Upload className="w-7 h-7 text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">
              {csvFileName ? `Loaded: ${csvFileName}` : t.soilModule.csvDropzone}
            </span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Main Grid: Parameters Form (Left) & Fertility / Crop Recommendations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-400" />
                Soil Sensor & Lab Parameters
              </h3>
              {inputMode === 'iot' && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  Live IoT Synced
                </span>
              )}
            </div>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{t.soilModule.nLabel}</span>
                <span className="font-mono text-emerald-300 font-bold">{n} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0 (Deficient)</span>
                <span>Optimal (60-120)</span>
                <span>180 (High)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{t.soilModule.pLabel}</span>
                <span className="font-mono text-emerald-300 font-bold">{p} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="145"
                step="1"
                value={p}
                onChange={(e) => setP(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0</span>
                <span>Optimal (40-75)</span>
                <span>145</span>
              </div>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{t.soilModule.kLabel}</span>
                <span className="font-mono text-emerald-300 font-bold">{k} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="210"
                step="1"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0</span>
                <span>Optimal (30-80)</span>
                <span>210</span>
              </div>
            </div>

            {/* pH */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{t.soilModule.phLabel}</span>
                <span className="font-mono text-emerald-300 font-bold">{ph.toFixed(1)} pH</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Acidic (&lt;6.0)</span>
                <span>Neutral (6.5-7.2)</span>
                <span>Alkaline (&gt;7.8)</span>
              </div>
            </div>

            {/* Moisture & Temperature row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.soilModule.moistureLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min="10"
                    max="95"
                    value={moisture}
                    onChange={(e) => setMoisture(Math.min(95, Math.max(10, parseInt(e.target.value) || 0)))}
                    className="w-16 bg-[#182a20] border border-emerald-800/70 rounded px-2 py-1 text-xs font-mono font-bold text-slate-100"
                  />
                  <span className="text-xs text-slate-400 font-mono">% Vol</span>
                </div>
              </div>

              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.soilModule.tempLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min="10"
                    max="45"
                    step="0.5"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value) || 20)}
                    className="w-16 bg-[#182a20] border border-emerald-800/70 rounded px-2 py-1 text-xs font-mono font-bold text-slate-100"
                  />
                  <span className="text-xs text-slate-400 font-mono">°C</span>
                </div>
              </div>
            </div>

            {/* Preset quick test buttons */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5">Load Regional Soil Profile:</span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => { setN(80); setP(48); setK(40); setPh(6.4); setMoisture(65); }}
                  className="p-1.5 rounded-lg bg-[#14231b] hover:bg-emerald-900/40 border border-emerald-900/50 text-slate-300"
                >
                  Alluvial Loam
                </button>
                <button
                  onClick={() => { setN(110); setP(35); setK(22); setPh(7.6); setMoisture(48); }}
                  className="p-1.5 rounded-lg bg-[#14231b] hover:bg-emerald-900/40 border border-emerald-900/50 text-slate-300"
                >
                  Black Vertisol
                </button>
                <button
                  onClick={() => { setN(40); setP(70); setK(85); setPh(5.6); setMoisture(42); }}
                  className="p-1.5 rounded-lg bg-[#14231b] hover:bg-emerald-900/40 border border-emerald-900/50 text-slate-300"
                >
                  Red Laterite
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fertility Rating & Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          {/* Composite Fertility Gauge & Nutrient Sufficiency */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/40 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                  {t.soilModule.fertilityScore}
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-black text-slate-100 font-mono">
                    {fertility.score}%
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getFertilityBadgeColor(fertility.classification)}`}>
                    {fertility.classification} Condition
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShcView(!shcView)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    shcView
                      ? 'bg-amber-950 text-amber-300 border-amber-600 shadow-sm'
                      : 'bg-[#14261c] text-slate-300 hover:text-white border-emerald-900/80 hover:border-emerald-700'
                  }`}
                >
                  {shcView ? '✓ Govt Soil Health Card View' : '📜 View Soil Health Card (SHC)'}
                </button>

                <button
                  onClick={handleSaveRecord}
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
                      Saved to Field Log!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Soil Reading
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Soil Health Card Mode Display */}
            {shcView ? (
              <div className="bg-gradient-to-br from-[#122b1b] to-[#0c1c12] border-2 border-emerald-600/70 rounded-2xl p-4 shadow-xl space-y-3 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-700/60 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                        GOVERNMENT OF INDIA • SOIL HEALTH CARD
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 font-devanagari">
                      मृदा स्वास्थ्य कार्ड (Ministry of Agriculture & Farmers Welfare)
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Sample ID</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">SHC-MH-2026-9921</span>
                  </div>
                </div>

                {/* SHC Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-800/60 text-slate-400 text-[11px]">
                        <th className="py-2 px-2">Nutrient / Parameter</th>
                        <th className="py-2 px-2">Test Value</th>
                        <th className="py-2 px-2">Govt Rating</th>
                        <th className="py-2 px-2">Standard Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/40 text-slate-200">
                      <tr>
                        <td className="py-2 px-2 font-medium">Available Nitrogen (N)</td>
                        <td className="py-2 px-2 font-mono font-bold text-emerald-300">{n} kg/ha</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            n < 60 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            n > 140 ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {n < 60 ? 'DEFICIENT (कम)' : n > 140 ? 'HIGH (अधिक)' : 'SUFFICIENT (पर्याप्त)'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-400 font-mono text-[11px]">60 - 120 kg/ha</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">Available Phosphorus (P)</td>
                        <td className="py-2 px-2 font-mono font-bold text-emerald-300">{p} kg/ha</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p < 40 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            p > 80 ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {p < 40 ? 'DEFICIENT (कम)' : p > 80 ? 'HIGH (अधिक)' : 'SUFFICIENT (पर्याप्त)'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-400 font-mono text-[11px]">40 - 75 kg/ha</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">Available Potassium (K)</td>
                        <td className="py-2 px-2 font-mono font-bold text-emerald-300">{k} kg/ha</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            k < 30 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            k > 90 ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {k < 30 ? 'DEFICIENT (कम)' : k > 90 ? 'HIGH (अधिक)' : 'SUFFICIENT (पर्याप्त)'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-400 font-mono text-[11px]">30 - 80 kg/ha</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">Soil Reaction (pH)</td>
                        <td className="py-2 px-2 font-mono font-bold text-emerald-300">{ph.toFixed(1)}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ph < 6.0 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            ph > 7.8 ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {ph < 6.0 ? 'ACIDIC (अम्लीय)' : ph > 7.8 ? 'ALKALINE (क्षारीय)' : 'NORMAL (उदासीन)'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-400 font-mono text-[11px]">6.0 - 7.5 pH</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-[11px] text-slate-300 border-t border-emerald-800/40 flex items-center justify-between">
                  <span>Soil Classification: <strong className="text-emerald-300">{activeSoilInfo.name}</strong></span>
                  <span className="text-emerald-400">Target Crop: <strong>{targetCrop}</strong></span>
                </div>
              </div>
            ) : null}

            {/* Individual Nutrient Status Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nutrientBreakdown.map((nut, idx) => (
                <div key={idx} className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{nut.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      nut.status === 'optimal' ? 'bg-emerald-950 text-emerald-400' :
                      nut.status === 'deficient' ? 'bg-amber-950 text-amber-400' :
                      'bg-purple-950 text-purple-400'
                    }`}>
                      {nut.status}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="font-mono text-emerald-300 font-semibold">{nut.current} {nut.unit}</span>
                    <span className="text-[10px] text-slate-500">Benchmark: {nut.optimalRange[0]}-{nut.optimalRange[1]} {nut.unit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        nut.status === 'optimal' ? 'bg-emerald-500' :
                        nut.status === 'deficient' ? 'bg-amber-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, nut.scorePct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kaggle ML Recommended Crops */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-emerald-400" />
                  {t.soilModule.cropRecommendationTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.soilModule.cropRecDesc}
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                Random Forest ML (99.1% Acc)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {recommendedCrops.map((crop, idx) => (
                <div 
                  key={idx}
                  className="bg-[#14231b] border border-emerald-900/50 rounded-xl p-3.5 space-y-2 hover:border-emerald-700/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-900/80 text-emerald-400 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      {crop.crop}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      {crop.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {crop.reason}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-emerald-900/40 pt-1.5">
                    <span>💧 {crop.waterRequirement}</span>
                    <span>🗓️ {crop.season}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fertilizer Prescription Plan */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.soilModule.fertilizerPrescription}
            </h3>
            <p className="text-xs text-slate-400">
              {t.soilModule.fertilizerDesc} (Target Crop: <strong className="text-slate-200">{activeField.cropType}</strong>)
            </p>

            <div className="space-y-2 pt-1">
              {fertilizerPrescription.map((fert, idx) => (
                <div key={idx} className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-300">{fert.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        fert.action === 'Add' ? 'bg-emerald-950 text-emerald-400' :
                        fert.action === 'Reduce' ? 'bg-rose-950 text-rose-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {fert.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{fert.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-200 bg-[#192b21] px-2.5 py-1 rounded-md border border-emerald-800/60 inline-block">
                      {fert.dosage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
