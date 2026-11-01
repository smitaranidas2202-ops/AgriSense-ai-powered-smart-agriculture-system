import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Wheat, 
  CreditCard, 
  CheckCircle2, 
  LogOut, 
  RefreshCw, 
  ShieldCheck,
  Save,
  QrCode
} from 'lucide-react';
import { FarmerUser, Language } from '../types';
import { translations } from '../i18n/translations';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  farmer: FarmerUser;
  onUpdateFarmer: (updated: FarmerUser) => void;
  onLogout: () => void;
  onOpenSwitchAccount: () => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  farmer,
  onUpdateFarmer,
  onLogout,
  onOpenSwitchAccount,
}) => {
  const t = translations[lang];

  const [name, setName] = useState<string>(farmer.name);
  const [phone, setPhone] = useState<string>(farmer.phone);
  const [district, setDistrict] = useState<string>(farmer.district);
  const [state, setState] = useState<string>(farmer.state);
  const [totalAcres, setTotalAcres] = useState<number>(farmer.totalAcres);
  const [primaryCrop, setPrimaryCrop] = useState<string>(farmer.primaryCrops[0] || 'Tomato');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FarmerUser = {
      ...farmer,
      name,
      phone,
      district,
      state,
      totalAcres: Number(totalAcres),
      primaryCrops: [primaryCrop, ...farmer.primaryCrops.slice(1)]
    };
    onUpdateFarmer(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl max-w-lg w-full p-6 shadow-xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--pastel-border-subtle,#e2ede5)] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={farmer.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
              alt={farmer.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-[var(--pastel-accent,#2e7d52)] shadow-xs"
            />
            <div>
              <h2 className="text-base font-extrabold text-[var(--pastel-text-title,#142d1f)] flex items-center gap-2">
                {farmer.name}
                <CheckCircle2 className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
              </h2>
              <p className="text-xs text-[var(--pastel-text-muted,#587564)] font-mono">
                {farmer.farmerIdNumber}
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

        {/* Body */}
        <div className="overflow-y-auto grow space-y-4 py-4 pr-1 text-xs">
          {/* Digital Kisan Card Badge */}
          <div className="bg-gradient-to-br from-[var(--pastel-accent-light,#e4f4ec)] to-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-accent-border,#bce3cb)] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pastel-card,white)] rounded-full blur-2xl opacity-70" />
            
            <div className="flex items-center justify-between border-b border-[var(--pastel-accent-border,#bce3cb)] pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-[var(--pastel-accent,#2e7d52)] font-extrabold tracking-wider uppercase text-[10px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Government Certified Kisan ID Card</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block">Holder Name</span>
                <span className="font-bold text-slate-100 text-xs">{farmer.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">KCC Registry No.</span>
                <span className="font-mono font-bold text-emerald-300">{farmer.farmerIdNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Registered Acreage</span>
                <span className="font-semibold text-slate-200">{farmer.totalAcres} Acres</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Agro-Climatic Zone</span>
                <span className="font-semibold text-slate-200">{farmer.district}, {farmer.state}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                📱 +91 {farmer.phone}
              </span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                🌱 {farmer.primaryCrops.join(', ')}
              </span>
            </div>
          </div>

          {/* Edit Form / Details Section */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 bg-[#14261c] p-4 rounded-2xl border border-emerald-900/60">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Edit Farmer Information
              </h3>

              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#182e22] border border-emerald-800 rounded-xl px-3 py-1.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#182e22] border border-emerald-800 rounded-xl px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Total Acres</label>
                  <input
                    type="number"
                    step="0.5"
                    value={totalAcres}
                    onChange={(e) => setTotalAcres(parseFloat(e.target.value))}
                    className="w-full bg-[#182e22] border border-emerald-800 rounded-xl px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#182e22] border border-emerald-800 rounded-xl px-3 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Primary Crop</label>
                  <input
                    type="text"
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    className="w-full bg-[#182e22] border border-emerald-800 rounded-xl px-3 py-1.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-slate-400 font-semibold">Account Actions</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs"
                >
                  Edit Profile
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenSwitchAccount();
                }}
                className="w-full p-3 rounded-xl bg-[#14261c] hover:bg-emerald-950/60 border border-emerald-900/60 text-slate-200 flex items-center justify-between text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  {t.auth.switchFarmer}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Demo Profiles</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-[#201414] hover:bg-rose-950/60 border border-rose-900/60 text-rose-300 flex items-center justify-between text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  {t.auth.logout}
                </span>
                <span className="text-[10px] text-rose-400">Exit Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-900/50 pt-3 text-right shrink-0">
          <button
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
