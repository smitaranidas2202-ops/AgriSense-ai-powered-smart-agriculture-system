import React, { useState } from 'react';
import { 
  Wheat, 
  Layers, 
  Search, 
  Filter, 
  Droplets, 
  Thermometer, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { IndianCropCategory, IndianSeason, Language } from '../types';
import { translations } from '../i18n/translations';
import { INDIAN_CROPS_DATABASE, INDIAN_SOIL_TYPES } from '../utils/indianAgriData';

interface CropSoilExplorerProps {
  lang: Language;
  onSelectCropForTesting: (cropName: string) => void;
  onSelectSoilPreset: (soilId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CropSoilExplorer: React.FC<CropSoilExplorerProps> = ({
  lang,
  onSelectCropForTesting,
  onSelectSoilPreset,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'crops' | 'soils'>('crops');
  
  // Crop filtering state
  const [cropSearch, setCropSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [activeCropModal, setActiveCropModal] = useState<typeof INDIAN_CROPS_DATABASE[0] | null>(null);

  // Soil filtering state
  const [soilSearch, setSoilSearch] = useState<string>('');
  const [activeSoilModal, setActiveSoilModal] = useState<typeof INDIAN_SOIL_TYPES[0] | null>(null);

  const categories: (IndianCropCategory | 'All')[] = [
    'All',
    'Cereals & Millets',
    'Pulses',
    'Oilseeds',
    'Cash Crops & Fibers',
    'Horticulture & Fruits',
    'Vegetables & Spices'
  ];

  const seasons: (IndianSeason | 'All')[] = [
    'All',
    'Kharif (Monsoon)',
    'Rabi (Winter)',
    'Perennial / Annual'
  ];

  const filteredCrops = INDIAN_CROPS_DATABASE.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
      c.hindiName.includes(cropSearch) ||
      c.marathiName.includes(cropSearch) ||
      c.botanicalName.toLowerCase().includes(cropSearch.toLowerCase()) ||
      c.majorProducingStates.some(s => s.toLowerCase().includes(cropSearch.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSeason = selectedSeason === 'All' || c.season === selectedSeason;

    return matchesSearch && matchesCategory && matchesSeason;
  });

  const filteredSoils = INDIAN_SOIL_TYPES.filter(s => {
    return (
      s.name.toLowerCase().includes(soilSearch.toLowerCase()) ||
      s.hindiName.includes(soilSearch) ||
      s.marathiName.includes(soilSearch) ||
      s.statesFound.some(st => st.toLowerCase().includes(soilSearch.toLowerCase())) ||
      s.bestSuitedCrops.some(cr => cr.toLowerCase().includes(soilSearch.toLowerCase()))
    );
  });

  const getCropDisplayName = (crop: typeof INDIAN_CROPS_DATABASE[0]) => {
    if (lang === 'hi') return `${crop.hindiName} (${crop.name})`;
    if (lang === 'mr') return `${crop.marathiName} (${crop.name})`;
    return crop.name;
  };

  const getSoilDisplayName = (soil: typeof INDIAN_SOIL_TYPES[0]) => {
    if (lang === 'hi') return `${soil.hindiName} - ${soil.name}`;
    if (lang === 'mr') return `${soil.marathiName} - ${soil.name}`;
    return soil.name;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Agricultural Knowledgebase (ICAR & Ministry of Agriculture)</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100">
              {lang === 'hi' ? 'भारतीय फसल एवं मृदा ज्ञानकोश' : lang === 'mr' ? 'भारतीय पीक व माती ज्ञानकोश' : 'Indian Crops & Soil Encyclopedia'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Comprehensive agronomic benchmarks across all major Indian seasons (Kharif, Rabi, Zaid) and the 8 official ICAR soil classifications.
            </p>
          </div>

          {/* Toggle View Mode: Crops vs Soils */}
          <div className="flex items-center bg-[#14261c] p-1.5 rounded-2xl border border-emerald-900/70 shrink-0">
            <button
              onClick={() => setViewMode('crops')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'crops'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wheat className="w-4 h-4" />
              <span>All Indian Crops ({INDIAN_CROPS_DATABASE.length})</span>
            </button>
            <button
              onClick={() => setViewMode('soils')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'soils'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>ICAR Soil Orders ({INDIAN_SOIL_TYPES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CROPS ENCYCLOPEDIA */}
      {viewMode === 'crops' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative grow max-w-md">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Indian crops (e.g. Wheat, कापूस, धान, Mustard, Maharashtra)..."
                  value={cropSearch}
                  onChange={(e) => setCropSearch(e.target.value)}
                  className="w-full bg-[#14231b] border border-emerald-900/70 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Season Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                <span className="text-[11px] text-slate-400 font-semibold shrink-0 mr-1">Season:</span>
                {seasons.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all ${
                      selectedSeason === s
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#14231b] text-slate-400 hover:text-slate-200 border border-emerald-900/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0 mr-1">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/80 font-bold'
                      : 'bg-[#14231b] text-slate-400 hover:text-slate-200 border border-emerald-900/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map(crop => (
              <div
                key={crop.id}
                className="bg-[#111e16] hover:bg-[#132219] border border-emerald-900/60 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col group"
              >
                {/* Crop Header Image & Badge */}
                <div className="relative h-40 w-full overflow-hidden bg-emerald-950">
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111e16] via-transparent to-black/40" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-700/50">
                    {crop.category}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-800">
                    {crop.season}
                  </span>

                  <div className="absolute bottom-2.5 left-3.5 right-3.5">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5 drop-shadow">
                      <span>{crop.icon}</span>
                      <span>{getCropDisplayName(crop)}</span>
                    </h3>
                    <p className="text-[11px] text-slate-300 italic font-mono drop-shadow">
                      {crop.botanicalName}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 grow flex flex-col justify-between text-xs">
                  {/* Agronomic Quick Gauges */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#15271d] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">NPK Target</span>
                      <span className="font-mono font-bold text-emerald-300 text-[11px]">
                        {crop.optimalN}-{crop.optimalP}-{crop.optimalK}
                      </span>
                    </div>

                    <div className="bg-[#15271d] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Ideal pH</span>
                      <span className="font-mono font-bold text-emerald-300 text-[11px]">
                        {crop.optimalPh[0]}-{crop.optimalPh[1]}
                      </span>
                    </div>

                    <div className="bg-[#15271d] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Water Need</span>
                      <span className="font-semibold text-blue-400 text-[11px]">
                        {crop.waterDemand}
                      </span>
                    </div>
                  </div>

                  {/* Producing States */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Major Producing States:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {crop.majorProducingStates.slice(0, 4).map((state, i) => (
                        <span key={i} className="text-[10px] bg-[#14231b] px-2 py-0.5 rounded text-slate-300 border border-emerald-900/40">
                          {state}
                        </span>
                      ))}
                      {crop.majorProducingStates.length > 4 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{crop.majorProducingStates.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fertilizer Plan Snippet */}
                  <div className="bg-[#14231b] p-2.5 rounded-xl border border-emerald-900/40 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-bold block mb-0.5">Fertilizer Schedule:</span>
                    <p className="line-clamp-2 leading-relaxed">{crop.fertilizerPlan}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectCropForTesting(crop.name);
                        onNavigateTab('soilAssessment');
                      }}
                      className="grow flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs transition-colors shadow-md shadow-emerald-950"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Test Soil for {crop.name}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ICAR SOIL ORDERS ENCYCLOPEDIA */}
      {viewMode === 'soils' && (
        <div className="space-y-5">
          {/* Search Bar */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4 shadow-md flex items-center justify-between gap-3">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Indian soil types (e.g. Black Cotton, जलोढ़, Laterite, Rajasthan)..."
                value={soilSearch}
                onChange={(e) => setSoilSearch(e.target.value)}
                className="w-full bg-[#14231b] border border-emerald-900/70 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="text-xs text-slate-400 hidden sm:block">
              ICAR 8 Official Soil Orders of India
            </div>
          </div>

          {/* Soils Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSoils.map(soil => (
              <div
                key={soil.id}
                className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-emerald-700/60 transition-all"
              >
                <div>
                  {/* Soil Title and Badges */}
                  <div className="flex items-start justify-between gap-2 border-b border-emerald-900/40 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: soil.colorHex }} />
                        <h3 className="text-base font-extrabold text-slate-100">
                          {getSoilDisplayName(soil)}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {soil.description}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 ${soil.badgeBg}`}>
                      {soil.coveragePercentIndia}% of India
                    </span>
                  </div>

                  {/* Typical Nutrient & Physical Benchmarks */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center text-xs">
                    <div className="bg-[#14231b] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Typical NPK</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {soil.typicalN}-{soil.typicalP}-{soil.typicalK}
                      </span>
                    </div>

                    <div className="bg-[#14231b] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Soil pH</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {soil.typicalPh.toFixed(1)} pH
                      </span>
                    </div>

                    <div className="bg-[#14231b] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Moisture Vol</span>
                      <span className="font-mono font-bold text-blue-400">
                        {soil.typicalMoisture}%
                      </span>
                    </div>

                    <div className="bg-[#14231b] p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">Water Holding</span>
                      <span className="font-semibold text-emerald-300">
                        {soil.waterRetention}
                      </span>
                    </div>
                  </div>

                  {/* Best Suited Indian Crops */}
                  <div className="pt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Optimal Native Crops:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {soil.bestSuitedCrops.map((c, i) => (
                        <span key={i} className="text-[11px] bg-emerald-950/70 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800/60 font-medium">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ICAR Health Tips */}
                  <div className="pt-3">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                      ICAR Soil Health Management Tips:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {soil.soilHealthTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 1-Click Action */}
                <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    States: {soil.statesFound.slice(0, 3).join(', ')}...
                  </span>
                  <button
                    onClick={() => {
                      onSelectSoilPreset(soil.id);
                      onNavigateTab('soilAssessment');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16291f] hover:bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Load Preset into Soil Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
