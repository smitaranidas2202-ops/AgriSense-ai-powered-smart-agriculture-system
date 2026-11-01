import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Sprout, 
  Layers, 
  Bug, 
  Clock, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Field, Language, LeafPrediction, PestRiskAssessment, SoilReading } from '../types';
import { translations } from '../i18n/translations';

interface HistoryAndChartsProps {
  lang: Language;
  activeField: Field;
  leafPredictions: LeafPrediction[];
  soilReadings: SoilReading[];
  pestAssessments: PestRiskAssessment[];
}

export const HistoryAndCharts: React.FC<HistoryAndChartsProps> = ({
  lang,
  activeField,
  leafPredictions,
  soilReadings,
  pestAssessments,
}) => {
  const t = translations[lang];
  const [filterModule, setFilterModule] = useState<'all' | 'crop' | 'soil' | 'pest'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Combine history timeline
  const combinedEvents = [
    ...leafPredictions.map(p => ({
      id: p.id,
      timestamp: p.timestamp,
      module: 'crop' as const,
      title: p.diseaseName,
      detail: `Confidence: ${(p.confidence * 100).toFixed(1)}% | Severity: ${p.severity}`,
      tag: p.crop,
      raw: p
    })),
    ...soilReadings.map(s => ({
      id: s.id,
      timestamp: s.timestamp,
      module: 'soil' as const,
      title: `Fertility Rating: ${s.fertilityRating}% (${s.fertilityClass})`,
      detail: `N: ${s.N} | P: ${s.P} | K: ${s.K} | pH: ${s.pH.toFixed(1)} | Moisture: ${s.moisture}%`,
      tag: s.source.toUpperCase(),
      raw: s
    })),
    ...pestAssessments.map(p => ({
      id: p.id,
      timestamp: p.timestamp,
      module: 'pest' as const,
      title: `Pest Risk: ${p.riskLevel} (${p.riskScore}%)`,
      detail: `${p.cropType} (${p.growthStage}) | Temp: ${p.weather.temperature}°C, RH: ${p.weather.humidity}%`,
      tag: p.sprayAdvisory.safeToSpray ? 'Spray Safe' : 'Spray Hold',
      raw: p
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredEvents = combinedEvents.filter(ev => {
    if (filterModule !== 'all' && ev.module !== filterModule) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ev.title.toLowerCase().includes(q) || ev.detail.toLowerCase().includes(q) || ev.tag.toLowerCase().includes(q);
    }
    return true;
  });

  // Mock historical 7-day health trend data points
  const healthTrajectory = [
    { day: 'Mon', score: 68 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 65 },
    { day: 'Thu', score: 74 },
    { day: 'Fri', score: 79 },
    { day: 'Sat', score: 81 },
    { day: 'Sun', score: 85 },
  ];

  const handleExportCsv = () => {
    let csv = 'Timestamp,Module,Title,Details,Field\n';
    filteredEvents.forEach(e => {
      csv += `"${e.timestamp}","${e.module}","${e.title}","${e.detail}","${activeField.name}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrisense_history_${activeField.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Farm Analytics & Chronological History</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-1">
            Prediction Trajectories & Field Logs
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Historical trends for <strong className="text-slate-200">{activeField.name}</strong> ({activeField.location})
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#14231b] border border-emerald-800 text-emerald-300 hover:bg-emerald-950 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export Field Logs (CSV)
        </button>
      </div>

      {/* Interactive SVG Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: 7-Day Farm Health Trajectory (Area Chart) */}
        <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              7-Day Farm Health Index Trajectory
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Avg: 75%
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines in Pastel */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="var(--pastel-border-subtle, #e2ede5)" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="380" y2="60" stroke="var(--pastel-border-subtle, #e2ede5)" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="380" y2="100" stroke="var(--pastel-border-subtle, #e2ede5)" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="380" y2="140" stroke="var(--pastel-border, #d4e5da)" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fill="var(--pastel-text-muted, #587564)" fontSize="10" fontFamily="monospace">100</text>
              <text x="12" y="64" fill="var(--pastel-text-muted, #587564)" fontSize="10" fontFamily="monospace">75</text>
              <text x="12" y="104" fill="var(--pastel-text-muted, #587564)" fontSize="10" fontFamily="monospace">50</text>
              <text x="18" y="144" fill="var(--pastel-text-muted, #587564)" fontSize="10" fontFamily="monospace">0</text>

              {/* Points calculation: x from 40 to 370 */}
              {/* Path area */}
              <path
                d="M 40,74 L 95,68 L 150,78 L 205,65 L 260,58 L 315,55 L 370,49 L 370,140 L 40,140 Z"
                fill="url(#areaGrad)"
              />
              {/* Stroke line */}
              <path
                d="M 40,74 L 95,68 L 150,78 L 205,65 L 260,58 L 315,55 L 370,49"
                fill="none"
                stroke="var(--pastel-accent, #2e7d52)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 40, y: 74, label: 'Mon', val: 68 },
                { x: 95, y: 68, label: 'Tue', val: 72 },
                { x: 150, y: 78, label: 'Wed', val: 65 },
                { x: 205, y: 65, label: 'Thu', val: 74 },
                { x: 260, y: 58, label: 'Fri', val: 79 },
                { x: 315, y: 55, label: 'Sat', val: 81 },
                { x: 370, y: 49, label: 'Sun', val: 85 },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="var(--pastel-card, #ffffff)" stroke="var(--pastel-accent, #2e7d52)" strokeWidth="2" />
                  <text x={pt.x} y="155" fill="var(--pastel-text-muted, #587564)" fontSize="10" textAnchor="middle">{pt.label}</text>
                  <text x={pt.x} y={pt.y - 8} fill="var(--pastel-accent, #2e7d52)" fontSize="9" fontWeight="bold" textAnchor="middle">{pt.val}%</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Soil Nutrient Balance Radar / Bar Distribution */}
        <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Soil Macronutrients vs Agronomic Benchmark
            </h3>
            <span className="text-xs font-mono text-emerald-400">Target Range</span>
          </div>

          <div className="h-52 w-full flex flex-col justify-around pt-1">
            {[
              { name: 'Nitrogen (N)', current: 78, max: 150, benchmark: [60, 120], unit: 'kg/ha', color: 'bg-emerald-500' },
              { name: 'Phosphorus (P)', current: 45, max: 100, benchmark: [40, 75], unit: 'kg/ha', color: 'bg-cyan-500' },
              { name: 'Potassium (K)', current: 42, max: 100, benchmark: [30, 80], unit: 'kg/ha', color: 'bg-amber-500' },
              { name: 'Moisture Vol', current: 58, max: 100, benchmark: [40, 70], unit: '%', color: 'bg-blue-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {item.current} {item.unit}
                    <span className="text-[10px] text-slate-500 font-normal ml-2">
                      (Target: {item.benchmark[0]}-{item.benchmark[1]})
                    </span>
                  </span>
                </div>
                <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  {/* Optimal band highlight */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-950/70 border-x border-emerald-600/40"
                    style={{
                      left: `${(item.benchmark[0] / item.max) * 100}%`,
                      width: `${((item.benchmark[1] - item.benchmark[0]) / item.max) * 100}%`
                    }}
                  />
                  {/* Actual level */}
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(item.current / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Logs Table */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-4">
          <div className="flex items-center gap-1.5 bg-[#14231b] p-1 rounded-xl border border-emerald-900/60 text-xs">
            <button
              onClick={() => setFilterModule('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterModule === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Events ({combinedEvents.length})
            </button>
            <button
              onClick={() => setFilterModule('crop')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterModule === 'crop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leaves ({leafPredictions.length})
            </button>
            <button
              onClick={() => setFilterModule('soil')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterModule === 'soil' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Soil ({soilReadings.length})
            </button>
            <button
              onClick={() => setFilterModule('pest')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterModule === 'pest' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pest ({pestAssessments.length})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search historical logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14231b] border border-emerald-900/70 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* List of Historical Log Entries */}
        <div className="space-y-2.5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching records found.
            </div>
          ) : (
            filteredEvents.map(event => (
              <div 
                key={event.id}
                className="bg-[#14231b] border border-emerald-900/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-700/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    event.module === 'crop' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    event.module === 'soil' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}>
                    {event.module === 'crop' ? <Sprout className="w-4 h-4" /> :
                     event.module === 'soil' ? <Layers className="w-4 h-4" /> :
                     <Bug className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{event.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/40 text-emerald-400 border border-emerald-900/40">
                        {event.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{event.detail}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-right">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
