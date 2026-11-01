import React from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Bell, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { FarmAlert, Language } from '../types';
import { translations } from '../i18n/translations';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  alerts: FarmAlert[];
  onMarkRead: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  isOpen,
  onClose,
  lang,
  alerts,
  onMarkRead,
  onNavigate,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const unreadCount = alerts.filter(a => !a.read).length;

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertBorder = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-[#f8c6c8] bg-[#fdeeed] text-[#b42b30]';
      case 'warning': return 'border-[#fed9b3] bg-[#fef4e8] text-[#9c5415]';
      default: return 'border-[#bce2cb] bg-[#e6f4ec] text-[#1b5e37]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl max-w-xl w-full p-6 shadow-xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--pastel-border-subtle,#e2ede5)] pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] flex items-center justify-center border border-[var(--pastel-accent-border,#bce3cb)]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Farm Risk Alerts
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Automated agronomic notifications across all registered plots
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts list */}
        <div className="overflow-y-auto grow py-4 space-y-3 pr-1">
          {alerts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No active alerts. All fields are operating within safe agronomic thresholds!
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-2xl border transition-all ${getAlertBorder(alert.severity)} ${
                  !alert.read ? 'ring-1 ring-emerald-500/30' : 'opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {getAlertIcon(alert.severity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{alert.title}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                          {alert.fieldName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!alert.read && (
                      <button
                        onClick={() => onMarkRead(alert.id)}
                        title="Mark as read"
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    Module: {alert.module}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      if (alert.module === 'crop') onNavigate('cropHealth');
                      else if (alert.module === 'soil') onNavigate('soilAssessment');
                      else onNavigate('pestRisk');
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Resolve in Module <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
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
