import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Wheat, 
  ShieldCheck, 
  CreditCard,
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { FarmerUser, Language } from '../types';
import { translations } from '../i18n/translations';
import { DEMO_FARMERS, getRegisteredFarmers, registerFarmer } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: (farmer: FarmerUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'otp' | 'password' | 'register'>('otp');

  // OTP Login state
  const [phone, setPhone] = useState<string>('9822012345');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Password Login state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('9822012345');
  const [password, setPassword] = useState<string>('kisan123');

  // Registration state
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regState, setRegState] = useState<string>('Maharashtra');
  const [regDistrict, setRegDistrict] = useState<string>('Nashik');
  const [regAcres, setRegAcres] = useState<number>(6.5);
  const [regCrop, setRegCrop] = useState<string>('Tomato');
  const [regKcc, setRegKcc] = useState<string>('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length >= 10) {
      setOtpSent(true);
      setOtpError('');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim() !== '1234') {
      setOtpError('Invalid code. Please enter 1234 for demo verification.');
      return;
    }

    // Find registered farmer with this phone, or create profile
    const registered = getRegisteredFarmers();
    let farmer = registered.find(f => f.phone.includes(phone.trim().slice(-10)));
    if (!farmer) {
      farmer = {
        id: 'farmer_' + Date.now(),
        name: 'Farmer ' + phone.slice(-4),
        phone: phone.trim(),
        farmerIdNumber: `KCC-REG-${Date.now().toString().slice(-4)}`,
        state: 'Maharashtra',
        district: 'Nashik',
        totalAcres: 5.0,
        primaryCrops: ['Tomato', 'Cotton'],
        preferredLanguage: lang,
        createdAt: new Date().toISOString().split('T')[0]
      };
      registerFarmer(farmer);
    }
    onLoginSuccess(farmer);
    onClose();
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const registered = getRegisteredFarmers();
    const farmer = registered.find(
      f => f.phone.includes(loginIdentifier) || f.email?.toLowerCase() === loginIdentifier.toLowerCase()
    ) || registered[0];

    onLoginSuccess(farmer);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    const newFarmer: FarmerUser = {
      id: 'farmer_' + Date.now(),
      name: regName.trim(),
      phone: regPhone.trim(),
      email: `${regName.toLowerCase().replace(/\s+/g, '.') || 'farmer'}@kisan.in`,
      farmerIdNumber: regKcc.trim() || `MH-${regDistrict.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      state: regState,
      district: regDistrict,
      totalAcres: Number(regAcres) || 4.0,
      primaryCrops: [regCrop],
      preferredLanguage: lang,
      createdAt: new Date().toISOString().split('T')[0]
    };

    registerFarmer(newFarmer);
    onLoginSuccess(newFarmer);
    onClose();
  };

  const handleQuickDemoSelect = (farmer: FarmerUser) => {
    onLoginSuccess(farmer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl max-w-lg w-full p-6 shadow-xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--pastel-border-subtle,#e2ede5)] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)] flex items-center justify-center shadow-xs font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--pastel-text-title,#142d1f)] flex items-center gap-2">
                {t.auth.loginTitle}
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)]">
                  Verified Farmer ID
                </span>
              </h2>
              <p className="text-xs text-[var(--pastel-text-muted,#587564)]">
                {t.auth.loginSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--pastel-text-muted,#587564)] hover:text-[var(--pastel-text-title,#142d1f)] hover:bg-[var(--pastel-surface,#edf5ef)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[var(--pastel-surface,#edf5ef)] p-1 rounded-xl text-xs gap-1 my-3.5 shrink-0 border border-[var(--pastel-border,#d4e5da)]">
          <button
            onClick={() => { setActiveTab('otp'); setOtpSent(false); }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'otp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.auth.phoneTab}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'password' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.auth.passwordTab}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'register' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.auth.registerTab}
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto grow space-y-4 pr-1">
          {/* Tab 1: Mobile Phone OTP Flow */}
          {activeTab === 'otp' && (
            <div className="space-y-4 text-xs">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      {t.auth.phoneNumber}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 flex items-center gap-1 text-slate-400 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9822012345"
                        maxLength={10}
                        className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl pl-16 pr-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    A secure 4-digit SMS OTP verification code will be sent to this number.
                  </p>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-950 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {t.auth.sendOtp}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t.auth.otpSentTo}</span>
                      <strong className="text-slate-100 font-mono">+91 {phone}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      {t.auth.enterOtp}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="1234"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value); setOtpError(''); }}
                      className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-base tracking-widest text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {otpError && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {otpError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => { setOtpCode('1234'); setOtpError(''); }}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.auth.autoFillOtp}
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">Demo: 1234</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-950 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.auth.verifyOtp}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: Password Login */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 9822012345 or ramesh.patil@kisan.in"
                  className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">{t.auth.password}</label>
                  <span className="text-[10px] text-slate-500">Default: kisan123</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-950 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                {t.auth.loginSubmit}
              </button>
            </form>
          )}

          {/* Tab 3: New Farmer Registration */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">{t.auth.fullName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balasaheb Shinde"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t.auth.phoneNumber}</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9822334455"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t.auth.farmSize}</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={regAcres}
                    onChange={(e) => setRegAcres(parseFloat(e.target.value))}
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">State</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Nashik / Ludhiana"
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t.auth.primaryCrop}</label>
                  <select
                    value={regCrop}
                    onChange={(e) => setRegCrop(e.target.value)}
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Corn (Maize)">Corn (Maize)</option>
                    <option value="Soybean">Soybean</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kisan ID / KCC (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-NSK-2026"
                    value={regKcc}
                    onChange={(e) => setRegKcc(e.target.value)}
                    className="w-full bg-[#15271d] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-950 transition-all mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t.auth.registerSubmit}
              </button>
            </form>
          )}

          {/* Quick Demo Farmer Switcher */}
          <div className="pt-3 border-t border-emerald-900/40">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t.auth.demoProfilesPrompt}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_FARMERS.map((farmer) => (
                <button
                  key={farmer.id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(farmer)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#14261c] hover:bg-emerald-950/60 border border-emerald-900/50 hover:border-emerald-600/60 text-left transition-all group"
                >
                  <img
                    src={farmer.avatarUrl}
                    alt={farmer.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-emerald-800"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-emerald-300">
                      {farmer.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {farmer.district} • {farmer.primaryCrops[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-900/50 pt-3 text-right shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
