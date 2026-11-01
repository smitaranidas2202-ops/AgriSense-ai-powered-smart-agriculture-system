import React, { useState } from 'react';
import { X, MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { Field, Language } from '../types';
import { translations } from '../i18n/translations';

interface NewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSaveField: (field: Field) => void;
}

export const NewFieldModal: React.FC<NewFieldModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSaveField,
}) => {
  const t = translations[lang];

  const [name, setName] = useState<string>('');
  const [cropType, setCropType] = useState<string>('Cotton');
  const [variety, setVariety] = useState<string>('');
  const [location, setLocation] = useState<string>('Nashik, Maharashtra');
  const [areaAcres, setAreaAcres] = useState<number>(4.0);
  const [soilType, setSoilType] = useState<string>('Black Clay Loam');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newField: Field = {
      id: 'field_' + Date.now(),
      name: name.trim(),
      cropType,
      variety: variety.trim() || undefined,
      location: location.trim(),
      latitude: 19.9975,
      longitude: 73.7898,
      areaAcres: Number(areaAcres) || 2.0,
      sowingDate: new Date().toISOString().split('T')[0],
      soilType
    };

    onSaveField(newField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl max-w-md w-full p-6 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--pastel-border-subtle,#e2ede5)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] flex items-center justify-center border border-[var(--pastel-accent-border,#bce3cb)]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--pastel-text-title,#142d1f)]">Add Agricultural Field</h2>
              <p className="text-xs text-[var(--pastel-text-muted,#587564)]">Register new acreage for monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--pastel-text-muted,#587564)] hover:text-[var(--pastel-text-title,#142d1f)] hover:bg-[var(--pastel-surface,#edf5ef)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Field / Plot Name</label>
            <input
              type="text"
              required
              placeholder="e.g. West Acre Greenhouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Primary Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
              >
                <option value="Tomato">Tomato</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Corn (Maize)">Corn (Maize)</option>
                <option value="Grapes">Grapes</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Soybean">Soybean</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value))}
                className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Location / District</label>
            <input
              type="text"
              placeholder="e.g. Nashik, Maharashtra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Soil Texture Class</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-[#14231b] border border-emerald-900/80 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
            >
              <option value="Black Clay Loam">Black Clay Loam (Vertisol)</option>
              <option value="Alluvial Silt Loam">Alluvial Silt Loam</option>
              <option value="Red Laterite Soil">Red Laterite Soil</option>
              <option value="Sandy Loam">Sandy Loam</option>
              <option value="Clayey Peat">Clayey Organic Peat</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-950"
            >
              <Plus className="w-4 h-4" />
              Register Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
