import React, { useState } from 'react';
import { 
  Activity, 
  Sprout, 
  Layers, 
  Bug, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  Bell,
  Volume2,
  VolumeX,
  PhoneCall,
  BookOpen,
  Camera,
  CheckCircle
} from 'lucide-react';
import { FarmAlert, FarmHealthIndex, FarmerUser, Field, Language, LeafPrediction, PestRiskAssessment, SoilReading } from '../types';
import { translations } from '../i18n/translations';
import { User } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';

interface DashboardProps {
  lang: Language;
  activeField: Field;
  farmHealth: FarmHealthIndex;
  recentAlerts: FarmAlert[];
  latestLeaf: LeafPrediction | null;
  latestSoil: SoilReading | null;
  latestPest: PestRiskAssessment | null;
  onNavigate: (tab: string) => void;
  onOpenAlerts: () => void;
  isIoTRunning: boolean;
  onOpenIoTModal: () => void;
  currentFarmer?: FarmerUser | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
  onOpenGuide?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lang,
  activeField,
  farmHealth,
  recentAlerts,
  latestLeaf,
  latestSoil,
  latestPest,
  onNavigate,
  onOpenAlerts,
  isIoTRunning,
  onOpenIoTModal,
  currentFarmer,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenGuide,
}) => {
  const t = translations[lang];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAdvisory = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const fieldName = activeField.name;
    const crop = activeField.cropType;
    const score = farmHealth.overallScore;
    const status = farmHealth.status;

    let text = '';
    if (lang === 'hi') {
      text = `नमस्ते किसान भाई। आपके खेत ${fieldName} की फसल ${crop} का समग्र स्वास्थ्य स्कोर सौ में से ${score} है। स्थिति ${status} है। `;
      if (latestLeaf) {
        text += `पत्ती रोग जांच में ${latestLeaf.diseaseName} पाया गया है। `;
      } else {
        text += `पत्तियां बिल्कुल स्वस्थ हैं। `;
      }
      if (latestPest) {
        text += `आज कीट प्रकोप जोखिम ${latestPest.riskLevel} है। `;
      }
      text += `आज की त्वरित सलाह और दवा की जानकारी के लिए स्क्रीन पर दिए गए बटन दबाएं।`;
    } else if (lang === 'mr') {
      text = `नमस्कार शेतकरी मित्र. तुमच्या शेताचे नाव ${fieldName}, पीक ${crop} असून आरोग्य स्कोअर १०० पैकी ${score} आहे. स्थिती ${status} आहे. `;
      if (latestLeaf) {
        text += `पानांच्या तपासणीत ${latestLeaf.diseaseName} आढळले आहे. `;
      } else {
        text += `पाने एकदम निरोगी आहेत. `;
      }
      if (latestPest) {
        text += `आज कीड धोका ${latestPest.riskLevel} आहे. `;
      }
      text += `सविस्तर मार्गदर्शनासाठी खालील बटणे दाबा.`;
    } else {
      text = `Hello Farmer. For your field ${fieldName} with crop ${crop}, overall farm health score is ${score} out of 100. Status is ${status}. `;
      if (latestLeaf) {
        text += `Leaf diagnosis shows ${latestLeaf.diseaseName}. `;
      } else {
        text += `Leaves are healthy. `;
      }
      if (latestPest) {
        text += `Today pest risk is ${latestPest.riskLevel}. `;
      }
      text += `Tap the quick action buttons below to explore detailed advice.`;
    }

    setIsPlayingAudio(true);
    speakText(text, lang, () => setIsPlayingAudio(false));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Thriving': return 'text-emerald-700 bg-emerald-50 border-emerald-300';
      case 'Good': return 'text-green-700 bg-green-50 border-green-300';
      case 'Attention Needed': return 'text-amber-800 bg-amber-50 border-amber-300';
      default: return 'text-rose-700 bg-rose-50 border-rose-300';
    }
  };

  const getHealthGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-amber-500';
  };

  const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical' || !a.read).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Composite Farm Health Banner in Pastel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--pastel-accent-light,#e4f4ec)] via-[var(--pastel-card,white)] to-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--pastel-accent-light,#e4f4ec)] rounded-full blur-3xl pointer-events-none opacity-60" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Title & Status */}
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pastel-card,white)] border border-[var(--pastel-accent-border,#bce3cb)] text-[var(--pastel-accent,#2e7d52)] text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[var(--pastel-accent,#2e7d52)]" />
              <span>Multi-Modal Agronomic Decision Engine</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--pastel-text-title,#142d1f)] tracking-tight">
              {t.dashboard.farmHealthTitle}: <span className="text-[var(--pastel-accent,#2e7d52)]">{activeField.name}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--pastel-text-body,#2b4536)] leading-relaxed">
              {t.dashboard.compositeDesc}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getStatusColor(farmHealth.status)}`}>
                ● {farmHealth.status}
              </span>

              {/* Farmer Audio Advisory Button */}
              <button
                onClick={handlePlayAdvisory}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
                  isPlayingAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-[var(--pastel-accent,#2e7d52)] hover:bg-[var(--pastel-accent-hover,#256b44)] text-white'
                }`}
                title="Listen to Audio Advisory"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>
                  {isPlayingAudio
                    ? (lang === 'hi' ? 'आवाज बंद करें' : lang === 'mr' ? 'आवाज थांबवा' : 'Stop Audio')
                    : (lang === 'hi' ? '🔊 आज की सलाह सुनें' : lang === 'mr' ? '🔊 आजचा सल्ला ऐका' : '🔊 Listen to Advisory')}
                </span>
              </button>

              {/* Farmer ID badge */}
              {currentFarmer ? (
                <button
                  onClick={onOpenProfileModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-accent-border,#bce3cb)] text-[var(--pastel-accent,#2e7d52)] transition-colors shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--pastel-accent,#2e7d52)]" />
                  <span>Kisan: {currentFarmer.name} ({currentFarmer.farmerIdNumber})</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.auth.loginBtn}</span>
                </button>
              )}

              <span className="text-xs text-[var(--pastel-text-muted,#587564)]">
                Crop: <strong className="text-[var(--pastel-text-title,#142d1f)]">{activeField.cropType}</strong> ({activeField.areaAcres} Acres)
              </span>
              <span className="text-xs text-[var(--pastel-text-muted,#587564)]">
                Location: <strong className="text-[var(--pastel-text-title,#142d1f)]">{activeField.location}</strong>
              </span>
            </div>
          </div>

          {/* Central Radial Score Display */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-2xl shadow-sm min-w-[240px]">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--pastel-border-subtle, #e2ede5)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#healthGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${farmHealth.overallScore * 2.64} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-[var(--pastel-text-title,#142d1f)] font-mono tracking-tighter">
                  {farmHealth.overallScore}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  / 100 Index
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-2">
              Combined Health Score
            </span>
          </div>
        </div>

        {/* 3 Sub-component Progress Bars in Pastel Theme */}
        <div className="mt-8 pt-6 border-t border-[var(--pastel-border-subtle,#e2ede5)] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crop Health (35%) */}
          <div 
            onClick={() => onNavigate('cropHealth')}
            className="cursor-pointer bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-surface,#edf5ef)] p-4 rounded-2xl border border-[var(--pastel-border,#d4e5da)] transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--pastel-text-title,#142d1f)] font-bold flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
                {t.dashboard.cropHealthComponent} (35%)
              </span>
              <span className="font-mono font-extrabold text-[var(--pastel-accent,#2e7d52)]">{farmHealth.cropHealthScore}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--pastel-surface,#edf5ef)] rounded-full overflow-hidden mb-2 border border-[var(--pastel-border-subtle,#e2ede5)]">
              <div 
                className="h-full bg-[var(--pastel-accent,#2e7d52)] rounded-full transition-all"
                style={{ width: `${farmHealth.cropHealthScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)] truncate">
              {lang === 'hi' ? 'ताज़ा जांच: ' : lang === 'mr' ? 'ताजी तपासणी: ' : 'Latest: '}
              <strong className="text-[var(--pastel-text-title,#142d1f)]">
                {latestLeaf ? latestLeaf.diseaseName : (lang === 'hi' ? 'स्वस्थ पत्ता' : lang === 'mr' ? 'निरोगी पान' : 'Healthy Leaf')}
              </strong>
            </p>
          </div>

          {/* Soil Fertility (35%) */}
          <div 
            onClick={() => onNavigate('soilAssessment')}
            className="cursor-pointer bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-surface,#edf5ef)] p-4 rounded-2xl border border-[var(--pastel-border,#d4e5da)] transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--pastel-text-title,#142d1f)] font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
                {t.dashboard.soilFertilityComponent} (35%)
              </span>
              <span className="font-mono font-extrabold text-[var(--pastel-accent,#2e7d52)]">{farmHealth.soilFertilityScore}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--pastel-surface,#edf5ef)] rounded-full overflow-hidden mb-2 border border-[var(--pastel-border-subtle,#e2ede5)]">
              <div 
                className="h-full bg-[var(--pastel-accent,#2e7d52)] rounded-full transition-all"
                style={{ width: `${farmHealth.soilFertilityScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)] truncate">
              {lang === 'hi' ? 'उर्वरकता: ' : lang === 'mr' ? 'सुपीकता: ' : 'Status: '}
              <strong className="text-[var(--pastel-text-title,#142d1f)]">
                {latestSoil ? `${latestSoil.fertilityClass} (pH ${latestSoil.pH})` : 'Balanced NPK'}
              </strong>
            </p>
          </div>

          {/* Pest Safety Margin (30%) */}
          <div 
            onClick={() => onNavigate('pestRisk')}
            className="cursor-pointer bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-surface,#edf5ef)] p-4 rounded-2xl border border-[var(--pastel-border,#d4e5da)] transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--pastel-text-title,#142d1f)] font-bold flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
                {t.dashboard.pestSafetyComponent} (30%)
              </span>
              <span className="font-mono font-extrabold text-[var(--pastel-accent,#2e7d52)]">{farmHealth.pestSafetyScore}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--pastel-surface,#edf5ef)] rounded-full overflow-hidden mb-2 border border-[var(--pastel-border-subtle,#e2ede5)]">
              <div 
                className="h-full bg-[var(--pastel-accent,#2e7d52)] rounded-full transition-all"
                style={{ width: `${farmHealth.pestSafetyScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)] truncate">
              {lang === 'hi' ? 'कीट जोखिम: ' : lang === 'mr' ? 'कीड धोका: ' : 'Risk: '}
              <strong className="text-[var(--pastel-text-title,#142d1f)]">
                {latestPest ? `${latestPest.riskLevel} Outbreak Risk` : (lang === 'hi' ? 'कम खतरा' : lang === 'mr' ? 'कमी धोका' : 'Low Threat')}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Farmer Quick Touch Action Bar (किसान त्वरित सहायता बार) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Quick 1: Scan Leaf */}
        <button
          onClick={() => onNavigate('cropHealth')}
          className="p-3.5 rounded-2xl bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-border,#d4e5da)] hover:border-[var(--pastel-accent-border,#bce3cb)] transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-700" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[var(--pastel-text-title,#142d1f)]">
              {lang === 'hi' ? 'पत्ते की जांच' : lang === 'mr' ? 'पानाची तपासणी' : 'Scan Leaf'}
            </h4>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)]">
              {lang === 'hi' ? 'बीमारी व देसी दवा' : lang === 'mr' ? 'रोग व उपाय' : 'Disease Diagnosis'}
            </p>
          </div>
        </button>

        {/* Quick 2: Fertilizer Bag Dosage */}
        <button
          onClick={() => onNavigate('soilAssessment')}
          className="p-3.5 rounded-2xl bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition-colors" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[var(--pastel-text-title,#142d1f)]">
              {lang === 'hi' ? 'खाद की गणना' : lang === 'mr' ? 'खतांचे गणित' : 'Fertilizer Dose'}
            </h4>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)]">
              {lang === 'hi' ? 'यूरिया, डीएपी बैग' : lang === 'mr' ? 'युरिया, डीएपी गोण्या' : 'Urea & DAP Bags'}
            </p>
          </div>
        </button>

        {/* Quick 3: Spray Safety Window */}
        <button
          onClick={() => onNavigate('pestRisk')}
          className="p-3.5 rounded-2xl bg-[var(--pastel-card,white)] hover:bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sky-700" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {lang === 'hi' ? 'सुरक्षित' : lang === 'mr' ? 'सुरक्षित' : 'Safe'}
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[var(--pastel-text-title,#142d1f)]">
              {lang === 'hi' ? 'आज छिड़काव करें?' : lang === 'mr' ? 'आज फवारणी करावी?' : 'Spray Today?'}
            </h4>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)]">
              {lang === 'hi' ? 'मौसम अनुसार सलाह' : lang === 'mr' ? 'हवामान सल्ला' : 'Weather Window'}
            </p>
          </div>
        </button>

        {/* Quick 4: Farmer Guide Manual */}
        <button
          onClick={() => {
            if (onOpenGuide) onOpenGuide();
          }}
          className="p-3.5 rounded-2xl bg-[var(--pastel-card,white)] hover:bg-amber-50 border border-amber-200 transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
              {lang === 'hi' ? 'मार्गदर्शिका' : lang === 'mr' ? 'मार्गदर्शिका' : 'Guide'}
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
              {lang === 'hi' ? 'उपयोग विधि' : lang === 'mr' ? 'वापर पद्धती' : 'How to Use'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {lang === 'hi' ? 'स्टेप-बाय-स्टेप गाइड' : lang === 'mr' ? 'सविस्तर माहिती' : 'Step-by-step'}
            </p>
          </div>
        </button>

        {/* Quick 5: Call Toll-Free Kisan Helpline */}
        <a
          href="tel:18001801551"
          className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white transition-all text-left shadow-xs flex flex-col justify-between hover:from-emerald-700 hover:to-teal-800"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-white text-emerald-800">
              {lang === 'hi' ? 'टोल-फ्री' : lang === 'mr' ? 'टोल-फ्री' : 'Free'}
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-white">
              {lang === 'hi' ? 'किसान कॉल सेंटर' : lang === 'mr' ? 'किसान कॉल सेंटर' : 'Kisan Helpline'}
            </h4>
            <p className="text-[11px] text-emerald-100 font-mono">
              1800-180-1551
            </p>
          </div>
        </a>
      </div>

      {/* Urgent Farm Alerts Section in Pastel Rose */}
      {criticalAlerts.length > 0 && (
        <div className="bg-[#fdeeed] border border-[#f8c6c8] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b42b30] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#b42b30]" />
              {t.dashboard.urgentAlerts}
            </h3>
            <button
              onClick={onOpenAlerts}
              className="text-xs text-[#b42b30] hover:text-[#8e2024] font-bold flex items-center gap-1"
            >
              View all ({recentAlerts.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {criticalAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-white border border-[#f8c6c8] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#b42b30]">{alert.title}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#fdeeed] text-[#b42b30] border border-[#f8c6c8]">
                      {alert.module}
                    </span>
                  </div>
                  <p className="text-[var(--pastel-text-body,#2b4536)] text-[11px] mt-0.5">{alert.message}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] text-[var(--pastel-text-muted,#587564)]">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => {
                      if (alert.module === 'crop') onNavigate('cropHealth');
                      else if (alert.module === 'soil') onNavigate('soilAssessment');
                      else onNavigate('pestRisk');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#b42b30] hover:bg-[#8e2024] text-white text-[11px] font-bold shadow-2xs"
                  >
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Section: Priority Agronomic Actions vs Field Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Priority Actions */}
        <div className="lg:col-span-7 bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t.dashboard.recommendedActions}
            </h3>
            <span className="text-[11px] text-slate-400">Field: {activeField.name}</span>
          </div>

          <div className="space-y-2.5">
            {farmHealth.actionItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#14231b] border border-emerald-900/50 rounded-xl p-3.5 flex items-start gap-3 hover:border-emerald-700/60 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${
                      item.priority === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      item.priority === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold font-mono">
                      Module: {item.module}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (item.module === 'crop') onNavigate('cropHealth');
                    else if (item.module === 'soil') onNavigate('soilAssessment');
                    else onNavigate('pestRisk');
                  }}
                  className="shrink-0 p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Field Microclimate & Telemetry Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                {t.dashboard.liveSensors} & Microclimate
              </h3>
              <button
                onClick={onOpenIoTModal}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                IoT Specs <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ambient Temp</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-100">
                  {latestPest?.weather.temperature ?? 28}°C
                </div>
                <span className="text-[10px] text-slate-500">Optimum: 20-30°C</span>
              </div>

              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Air Humidity</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-100">
                  {latestPest?.weather.humidity ?? 76}%
                </div>
                <span className="text-[10px] text-slate-500">Sporulation: &gt;75%</span>
              </div>

              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Soil Moisture</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-100">
                  {latestSoil?.moisture ?? 58}%
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Tensiometer Good</span>
              </div>

              <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Soil pH</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-100">
                  {latestSoil?.pH.toFixed(1) ?? '6.4'}
                </div>
                <span className="text-[10px] text-slate-400">Nutrient available</span>
              </div>
            </div>

            {/* IoT Gateway mini status */}
            <div className="p-2.5 rounded-xl bg-[#14231b] border border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isIoTRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-slate-300 font-medium">ESP32 LoRa Gateway</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                {isIoTRunning ? 'Live Telemetry (3.5s)' : 'Standby Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quick Action Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => onNavigate('cropHealth')}
          className="bg-[#111e16] hover:bg-[#14251b] border border-emerald-900/60 p-5 rounded-2xl cursor-pointer transition-all group shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
            Scan Leaf Photo (Grad-CAM)
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Detect early fungal/bacterial blights via MobileNetV2 with heatmaps.
          </p>
        </div>

        <div
          onClick={() => onNavigate('soilAssessment')}
          className="bg-[#111e16] hover:bg-[#14251b] border border-emerald-900/60 p-5 rounded-2xl cursor-pointer transition-all group shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
            Assess Soil & Predict Crops
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Input N-P-K & pH, upload sensor CSV, and compute fertilizer dosage.
          </p>
        </div>

        <div
          onClick={() => onNavigate('pestRisk')}
          className="bg-[#111e16] hover:bg-[#14251b] border border-emerald-900/60 p-5 rounded-2xl cursor-pointer transition-all group shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
            Live Pest & Spray Advisory
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Microclimate weather outbreak index & optimal spray timing windows.
          </p>
        </div>
      </div>
    </div>
  );
};
