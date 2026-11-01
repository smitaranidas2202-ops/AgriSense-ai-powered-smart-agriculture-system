import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  X, 
  Play, 
  Square, 
  Zap, 
  Wifi, 
  Battery, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Droplets, 
  Thermometer,
  Send,
  Code
} from 'lucide-react';
import { Language, SoilReading } from '../types';
import { translations } from '../i18n/translations';

interface IoTSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isRunning: boolean;
  onToggleRunning: () => void;
  latestReadings: {
    N: number;
    P: number;
    K: number;
    pH: number;
    moisture: number;
    temperature: number;
  };
  packetCount: number;
  onApplyToSoil: () => void;
}

export const IoTSimulatorModal: React.FC<IoTSimulatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  isRunning,
  onToggleRunning,
  latestReadings,
  packetCount,
  onApplyToSoil,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'stream' | 'hardware'>('stream');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyToSoil();
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  // Mock telemetry JSON payload
  const telemetryJson = JSON.stringify(
    {
      device_id: 'ESP32_AGRI_NODE_01',
      protocol: 'LoRaWAN_v1.0.4',
      dev_eui: '70B3D57ED0049AC1',
      frequency_mhz: 865.0625,
      rssi_dbm: -74,
      snr_db: 9.2,
      battery_v: 3.92,
      battery_pct: 88,
      timestamp: new Date().toISOString(),
      sensors: {
        rs485_probe: {
          nitrogen_kg_ha: latestReadings.N,
          phosphorus_kg_ha: latestReadings.P,
          potassium_kg_ha: latestReadings.K,
          soil_ph: latestReadings.pH,
          soil_moisture_pct: latestReadings.moisture,
          soil_temp_c: latestReadings.temperature,
          ec_us_cm: 412
        }
      }
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--pastel-border-subtle,#e2ede5)] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isRunning ? 'bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)]' : 'bg-[var(--pastel-surface,#edf5ef)] text-[var(--pastel-text-muted,#587564)]'
            }`}>
              <Radio className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--pastel-text-title,#142d1f)]">
                {t.iot.modalTitle}
              </h2>
              <p className="text-xs text-[var(--pastel-text-muted,#587564)]">
                {t.iot.modalSubtitle}
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

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stream' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-[var(--pastel-text-muted,#587564)] hover:bg-[var(--pastel-surface,#edf5ef)]'
            }`}
          >
            Live Telemetry Stream
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hardware' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-[var(--pastel-text-muted,#587564)] hover:bg-[var(--pastel-surface,#edf5ef)]'
            }`}
          >
            Hardware Architecture (Future Scope)
          </button>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto grow py-4 space-y-4 pr-1">
          {activeTab === 'stream' ? (
            <>
              {/* Telemetry Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block">{t.iot.gatewayStatus}</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                    {isRunning ? 'Streaming (3.5s)' : 'Paused'}
                  </span>
                </div>

                <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block">{t.iot.packetCount}</span>
                  <span className="font-bold font-mono text-slate-100 mt-0.5 block">{packetCount} pkts</span>
                </div>

                <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block">{t.iot.signalStrength}</span>
                  <span className="font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> -74 dBm
                  </span>
                </div>

                <div className="bg-[#14231b] p-3 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block">{t.iot.batteryLevel}</span>
                  <span className="font-bold font-mono text-emerald-300 mt-0.5 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" /> 88% (3.92V)
                  </span>
                </div>
              </div>

              {/* Real-time gauge metrics */}
              <div className="bg-[#14231b] border border-emerald-900/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Current Sensor Telemetry Values:</span>
                  <span className="text-[11px] font-mono text-emerald-400">RS485 Modbus Node #1</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">N</span>
                    <span className="font-bold text-emerald-300">{latestReadings.N}</span>
                  </div>
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">P</span>
                    <span className="font-bold text-emerald-300">{latestReadings.P}</span>
                  </div>
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">K</span>
                    <span className="font-bold text-emerald-300">{latestReadings.K}</span>
                  </div>
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">pH</span>
                    <span className="font-bold text-emerald-300">{latestReadings.pH.toFixed(1)}</span>
                  </div>
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">Moisture</span>
                    <span className="font-bold text-blue-400">{latestReadings.moisture}%</span>
                  </div>
                  <div className="bg-[#1a2d22] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-sans">Temp</span>
                    <span className="font-bold text-amber-400">{latestReadings.temperature}°C</span>
                  </div>
                </div>
              </div>

              {/* Raw JSON Stream Terminal */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
                    {t.iot.telemetryFeed}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Auto-refresh 3.5s</span>
                </div>
                <div className="bg-[#09110c] border border-emerald-950 rounded-xl p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-44 scrollbar-none shadow-inner">
                  <pre>{telemetryJson}</pre>
                </div>
              </div>
            </>
          ) : (
            /* Hardware Architecture & Specs tab */
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-[#14231b] border border-emerald-900/50 space-y-2">
                <h4 className="font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Physical Hardware Deployment Architecture
                </h4>
                <p className="leading-relaxed text-slate-300">
                  The production-grade physical installation uses industrial optical and capacitive probes interfaced with an ultra-low-power ESP32 MCU sleeping for 99.8% of duty cycles:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li><strong>Soil Probe:</strong> JXCT 7-in-1 Optical Soil NPK, pH, EC, Moisture & Temp Sensor via RS485 Modbus RTU protocol (MAX485 transceiver).</li>
                  <li><strong>Microcontroller:</strong> ESP32-WROOM-32E (240MHz Dual Core, deep sleep mode consuming &lt;15μA).</li>
                  <li><strong>Wireless Transceiver:</strong> Semtech SX1262 LoRa module (865-867 MHz India band, +22dBm output, &gt;6km line-of-sight range).</li>
                  <li><strong>Power System:</strong> 18650 LiFePO4 3.2V 3200mAh battery paired with a 5V 2W monocrystalline solar panel and MPPT charger for perpetual operation.</li>
                  <li><strong>Gateway:</strong> Dragino LPS8N 8-channel LoRaWAN gateway routing packets over 4G LTE/WiFi to FastAPI backend.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-emerald-900/50 pt-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                {t.iot.stopSim}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {t.iot.startSim}
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#14231b] border border-emerald-700 text-emerald-300 hover:bg-emerald-950 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {appliedNotice ? 'Pushed to Soil Form!' : 'Push Values to Soil Module'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
