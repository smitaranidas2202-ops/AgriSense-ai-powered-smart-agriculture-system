import React from 'react';
import { 
  Sprout, 
  Activity, 
  Layers, 
  Bug, 
  Radio, 
  BarChart3, 
  FileText, 
  Bell, 
  Globe, 
  MapPin, 
  Plus,
  BookOpen,
  User,
  Palette
} from 'lucide-react';
import { FarmerUser, Field, Language, PastelTheme } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (l: Language) => void;
  pastelTheme: PastelTheme;
  setPastelTheme: (theme: PastelTheme) => void;
  fields: Field[];
  activeFieldId: string;
  setActiveFieldId: (id: string) => void;
  onOpenNewFieldModal: () => void;
  onOpenIoTModal: () => void;
  isIoTRunning: boolean;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
  farmHealthScore: number;
  currentFarmer: FarmerUser | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenGuide: () => void;
  isEasyReadMode: boolean;
  onToggleEasyReadMode: () => void;
}

const PASTEL_THEMES: { id: PastelTheme; label: string; color: string; ring: string }[] = [
  { id: 'mint', label: 'Pastel Mint', color: '#9cd1b3', ring: '#2e7d52' },
  { id: 'peach', label: 'Pastel Peach', color: '#f7c4a5', ring: '#ba6438' },
  { id: 'lavender', label: 'Pastel Lavender', color: '#d2c4ea', ring: '#6b51a0' },
  { id: 'sky', label: 'Pastel Sky', color: '#a8d2f3', ring: '#3371ad' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  pastelTheme,
  setPastelTheme,
  fields,
  activeFieldId,
  setActiveFieldId,
  onOpenNewFieldModal,
  onOpenIoTModal,
  isIoTRunning,
  unreadAlertCount,
  onOpenAlerts,
  farmHealthScore,
  currentFarmer,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenGuide,
  isEasyReadMode,
  onToggleEasyReadMode,
}) => {
  const t = translations[lang];

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-[#e6f4ec] text-[#1b5e37] border-[#bce2cb]';
    if (score >= 60) return 'bg-[#fef4e8] text-[#9c5415] border-[#fed9b3]';
    return 'bg-[#fdeeed] text-[#b42b30] border-[#f8c4c7]';
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--pastel-nav,white)] backdrop-blur-md border-b border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-text-title,#142d1f)] transition-colors duration-200">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-accent-border,#bce3cb)] flex items-center justify-center shadow-xs transition-colors">
            <Sprout className="w-5 h-5 text-[var(--pastel-accent,#2e7d52)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--pastel-text-title,#142d1f)]">
                AgriSense AI
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)]">
                PASTEL AGRI-OS
              </span>
            </div>
            <p className="text-[11px] text-[var(--pastel-text-muted,#587564)] hidden sm:block truncate max-w-xs md:max-w-md">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right side controls: Field Selector, IoT, Theme, Lang, Alerts */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active Field Picker */}
          <div className="flex items-center gap-1.5 bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] rounded-xl px-2.5 py-1 text-xs shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[var(--pastel-accent,#2e7d52)] shrink-0" />
            <span className="text-[var(--pastel-text-muted,#587564)] hidden lg:inline">{t.nav.fieldSelect}</span>
            <select
              value={activeFieldId}
              onChange={(e) => setActiveFieldId(e.target.value)}
              className="bg-transparent text-[var(--pastel-text-title,#142d1f)] font-semibold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {fields.map(f => (
                <option key={f.id} value={f.id} className="bg-[var(--pastel-card,white)] text-[var(--pastel-text-title,#142d1f)]">
                  {f.name} ({f.cropType})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenNewFieldModal}
              title={t.nav.addField}
              className="text-[var(--pastel-accent,#2e7d52)] hover:text-[var(--pastel-accent-hover,#256b44)] p-0.5 rounded hover:bg-[var(--pastel-accent-light,#e4f4ec)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Farm Health Pill */}
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className={`cursor-pointer px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${getHealthBadgeColor(farmHealthScore)}`}
            title="Composite Farm Health Score"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{farmHealthScore}/100</span>
            <span className="text-[10px] hidden md:inline font-normal opacity-90">Score</span>
          </div>

          {/* IoT Telemetry Stream Status */}
          <button
            onClick={onOpenIoTModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isIoTRunning
                ? 'bg-[var(--pastel-accent-light,#e4f4ec)] border-[var(--pastel-accent-border,#bce3cb)] text-[var(--pastel-accent,#2e7d52)]'
                : 'bg-[var(--pastel-surface,#edf5ef)] border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-text-muted,#587564)]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isIoTRunning ? 'text-[var(--pastel-accent,#2e7d52)]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">IoT:</span>
            <span className="text-[11px]">
              {isIoTRunning ? t.nav.connected : t.nav.disconnected}
            </span>
          </button>

          {/* Pastel Palette Switcher */}
          <div className="flex items-center gap-1 bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] rounded-xl px-2 py-1" title="Pastel Themes">
            <Palette className="w-3.5 h-3.5 text-[var(--pastel-accent,#2e7d52)] mr-0.5 shrink-0" />
            {PASTEL_THEMES.map((theme) => {
              const isActive = pastelTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setPastelTheme(theme.id)}
                  title={theme.label}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    isActive ? 'scale-125 ring-2 ring-offset-1' : 'opacity-80 hover:scale-110 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: theme.color,
                    outlineColor: theme.ring
                  }}
                />
              );
            })}
          </div>

          {/* Farmer Guide Walkthrough Modal Trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs"
            title={lang === 'hi' ? 'किसान मार्गदर्शिका एवं उपयोग विधि' : lang === 'mr' ? 'शेतकरी मार्गदर्शिका' : 'Farmer Guide & Manual'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-extrabold text-[11px]">
              {lang === 'hi' ? '📖 मार्गदर्शिका' : lang === 'mr' ? '📖 मार्गदर्शिका' : '📖 Guide'}
            </span>
          </button>

          {/* Easy-Read Mode (Text Scaler for field/sunlight) */}
          <button
            onClick={onToggleEasyReadMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold border transition-all ${
              isEasyReadMode
                ? 'bg-[var(--pastel-accent,#2e7d52)] text-white border-[var(--pastel-accent,#2e7d52)] shadow-2xs'
                : 'bg-[var(--pastel-surface,#edf5ef)] border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-text-body,#2b4536)] hover:bg-[var(--pastel-surface-hover,#e3efe6)]'
            }`}
            title="Toggle Outdoor Easy-Read Mode (Larger text for bright sunlight)"
          >
            <span className="text-[11px] font-black">A+</span>
            <span className="hidden xl:inline text-[11px]">
              {isEasyReadMode 
                ? (lang === 'hi' ? 'बड़ा फ़ॉन्ट' : lang === 'mr' ? 'मोठा फॉन्ट' : 'Large') 
                : (lang === 'hi' ? 'आसान मोड' : lang === 'mr' ? 'सुलभ मोड' : 'Easy Mode')}
            </span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 rounded-xl bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-text-body,#2b4536)] hover:bg-[var(--pastel-surface-hover,#e3efe6)] transition-colors"
            title={t.nav.alerts}
          >
            <Bell className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Language Switcher (EN, HI, MR) */}
          <div className="flex items-center bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] rounded-xl p-0.5 text-xs">
            <Globe className="w-3 h-3 text-[var(--pastel-accent,#2e7d52)] mx-1 hidden sm:block" />
            {(['en', 'hi', 'mr'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all ${
                  lang === l
                    ? 'bg-[var(--pastel-card,white)] text-[var(--pastel-accent,#2e7d52)] shadow-2xs border border-[var(--pastel-border-subtle,#e2ede5)]'
                    : 'text-[var(--pastel-text-muted,#587564)] hover:text-[var(--pastel-text-title,#142d1f)]'
                }`}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Farmer Login / Profile Pill */}
          {currentFarmer ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-accent-border,#bce3cb)] hover:bg-[var(--pastel-accent-light,#e4f4ec)] text-xs text-[var(--pastel-text-title,#142d1f)] transition-all shadow-2xs"
              title={t.auth.profileBtn}
            >
              <img
                src={currentFarmer.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
                alt={currentFarmer.name}
                className="w-5 h-5 rounded-md object-cover border border-[var(--pastel-accent,#2e7d52)] shrink-0"
              />
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold text-[var(--pastel-text-title,#142d1f)] leading-tight truncate max-w-[95px]">
                  {currentFarmer.name}
                </p>
                <p className="text-[9px] text-[var(--pastel-text-muted,#587564)] font-mono leading-none">
                  {currentFarmer.district}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.auth.loginBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--pastel-border-subtle,#e2ede5)] overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1.5 py-1.5 min-w-max">
          {[
            { id: 'dashboard', label: t.nav.dashboard, icon: Activity },
            { id: 'cropSoilExplorer', label: (t.nav as any).cropSoilExplorer || 'Crop & Soil Guide', icon: BookOpen },
            { id: 'cropHealth', label: t.nav.cropHealth, icon: Sprout },
            { id: 'soilAssessment', label: t.nav.soilAssessment, icon: Layers },
            { id: 'pestRisk', label: t.nav.pestRisk, icon: Bug },
            { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
            { id: 'techDocs', label: t.nav.techDocs, icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)] shadow-2xs'
                    : 'text-[var(--pastel-text-muted,#587564)] hover:text-[var(--pastel-text-title,#142d1f)] hover:bg-[var(--pastel-surface,#edf5ef)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--pastel-accent,#2e7d52)]' : 'text-[var(--pastel-text-muted,#587564)]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
