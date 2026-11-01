/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CropHealthModule } from './components/CropHealthModule';
import { SoilAssessmentModule } from './components/SoilAssessmentModule';
import { PestRiskModule } from './components/PestRiskModule';
import { HistoryAndCharts } from './components/HistoryAndCharts';
import { TechDocsAndMetrics } from './components/TechDocsAndMetrics';
import { IoTSimulatorModal } from './components/IoTSimulatorModal';
import { AlertsPanel } from './components/AlertsPanel';
import { NewFieldModal } from './components/NewFieldModal';
import { AuthModal } from './components/AuthModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { CropSoilExplorer } from './components/CropSoilExplorer';
import { FarmerGuideModal } from './components/FarmerGuideModal';
import { FarmerUser, Field, Language, LeafPrediction, PestRiskAssessment, SoilReading, PastelTheme } from './types';
import { 
  calculateFarmHealthIndex, 
  getActiveFieldId, 
  getCurrentFarmer, 
  getStoredAlerts, 
  getStoredFields, 
  getStoredLeafPredictions, 
  getStoredPestAssessments, 
  getStoredSoilReadings, 
  getStoredPastelTheme,
  setStoredPastelTheme,
  markAlertRead, 
  saveField, 
  saveLeafPrediction, 
  savePestAssessment, 
  saveSoilReading, 
  setCurrentFarmer, 
  updateFarmerProfile, 
  setActiveFieldId as persistActiveFieldId 
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [pastelTheme, setPastelTheme] = useState<PastelTheme>(getStoredPastelTheme());

  const handleSetPastelTheme = (theme: PastelTheme) => {
    setPastelTheme(theme);
    setStoredPastelTheme(theme);
    document.documentElement.setAttribute('data-pastel', theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-pastel', pastelTheme);
  }, [pastelTheme]);

  // Fields state
  const [fields, setFields] = useState<Field[]>([]);
  const [activeFieldId, setActiveFieldIdState] = useState<string>('');

  // Module records state
  const [alerts, setAlerts] = useState(getStoredAlerts());
  const [leafPredictions, setLeafPredictions] = useState<LeafPrediction[]>([]);
  const [soilReadings, setSoilReadings] = useState<SoilReading[]>([]);
  const [pestAssessments, setPestAssessments] = useState<PestRiskAssessment[]>([]);

  // Modals state
  const [isIoTModalOpen, setIsIoTModalOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isNewFieldOpen, setIsNewFieldOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isEasyReadMode, setIsEasyReadMode] = useState<boolean>(false);

  // Farmer auth state
  const [currentFarmer, setCurrentFarmerState] = useState<FarmerUser | null>(getCurrentFarmer());

  // Indian Crops & Soil Explorer Preselection
  const [preselectedCrop, setPreselectedCrop] = useState<string>('');
  const [preselectedSoilId, setPreselectedSoilId] = useState<string>('');

  // IoT Simulation State
  const [isIoTRunning, setIsIoTRunning] = useState<boolean>(true);
  const [packetCount, setPacketCount] = useState<number>(142);
  const [latestIoTData, setLatestIoTData] = useState<{
    N: number;
    P: number;
    K: number;
    pH: number;
    moisture: number;
    temperature: number;
  }>({
    N: 78,
    P: 45,
    K: 40,
    pH: 6.4,
    moisture: 58,
    temperature: 26.5
  });

  // Load initial data
  useEffect(() => {
    const loadedFields = getStoredFields();
    setFields(loadedFields);
    const initialActiveId = getActiveFieldId() || loadedFields[0]?.id || 'field_1';
    setActiveFieldIdState(initialActiveId);
    refreshData(initialActiveId);
  }, []);

  const refreshData = (fId: string) => {
    setLeafPredictions(getStoredLeafPredictions(fId));
    setSoilReadings(getStoredSoilReadings(fId));
    setPestAssessments(getStoredPestAssessments(fId));
    setAlerts(getStoredAlerts());
  };

  const handleSetActiveFieldId = (id: string) => {
    setActiveFieldIdState(id);
    persistActiveFieldId(id);
    refreshData(id);
  };

  // IoT Telemetry generator loop
  useEffect(() => {
    if (!isIoTRunning) return;

    const interval = setInterval(() => {
      setPacketCount(prev => prev + 1);
      setLatestIoTData(prev => {
        // Natural environmental fluctuations
        const jitterN = Math.round((Math.random() - 0.48) * 2);
        const jitterP = Math.round((Math.random() - 0.48) * 1.5);
        const jitterK = Math.round((Math.random() - 0.48) * 1.5);
        const jitterMoisture = Math.round((Math.random() - 0.5) * 1.2);
        const jitterTemp = Math.round((Math.random() - 0.5) * 0.4 * 10) / 10;
        const jitterPh = Math.round((Math.random() - 0.5) * 0.05 * 10) / 10;

        return {
          N: Math.max(20, Math.min(160, prev.N + jitterN)),
          P: Math.max(15, Math.min(95, prev.P + jitterP)),
          K: Math.max(15, Math.min(110, prev.K + jitterK)),
          pH: Math.max(5.0, Math.min(8.5, prev.pH + jitterPh)),
          moisture: Math.max(25, Math.min(85, prev.moisture + jitterMoisture)),
          temperature: Math.max(18, Math.min(40, prev.temperature + jitterTemp)),
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isIoTRunning]);

  const activeField = fields.find(f => f.id === activeFieldId) || fields[0] || {
    id: 'field_1',
    name: 'North Acre Plot',
    cropType: 'Tomato',
    location: 'Nashik, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7898,
    areaAcres: 3.5,
    sowingDate: '2026-09-15',
    soilType: 'Black Clay Loam'
  };

  const farmHealth = calculateFarmHealthIndex(activeField.id);

  const handleSavePrediction = (pred: LeafPrediction) => {
    saveLeafPrediction(pred);
    refreshData(activeField.id);
  };

  const handleSaveSoilReading = (reading: SoilReading) => {
    saveSoilReading(reading);
    refreshData(activeField.id);
  };

  const handleSavePestAssessment = (assessment: PestRiskAssessment) => {
    savePestAssessment(assessment);
    refreshData(activeField.id);
  };

  const handleSaveNewField = (newField: Field) => {
    saveField(newField);
    const updated = getStoredFields();
    setFields(updated);
    handleSetActiveFieldId(newField.id);
  };

  const handleMarkAlertRead = (alertId: string) => {
    markAlertRead(alertId);
    setAlerts(getStoredAlerts());
  };

  const handleLoginSuccess = (farmer: FarmerUser) => {
    setCurrentFarmerState(farmer);
    setCurrentFarmer(farmer);
    if (farmer.preferredLanguage) {
      setLang(farmer.preferredLanguage);
    }
  };

  const handleLogout = () => {
    setCurrentFarmerState(null);
    setCurrentFarmer(null);
  };

  const handleUpdateFarmer = (updated: FarmerUser) => {
    setCurrentFarmerState(updated);
    updateFarmerProfile(updated);
  };

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  return (
    <div className={`min-h-screen bg-[var(--pastel-bg,#f4f8f5)] text-[var(--pastel-text-body,#2b4536)] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-200 ${isEasyReadMode ? 'farmer-easy-mode' : ''}`} data-pastel={pastelTheme}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        pastelTheme={pastelTheme}
        setPastelTheme={handleSetPastelTheme}
        fields={fields}
        activeFieldId={activeFieldId}
        setActiveFieldId={handleSetActiveFieldId}
        onOpenNewFieldModal={() => setIsNewFieldOpen(true)}
        onOpenIoTModal={() => setIsIoTModalOpen(true)}
        isIoTRunning={isIoTRunning}
        unreadAlertCount={unreadAlertCount}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        farmHealthScore={farmHealth.overallScore}
        currentFarmer={currentFarmer}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        isEasyReadMode={isEasyReadMode}
        onToggleEasyReadMode={() => setIsEasyReadMode(!isEasyReadMode)}
      />

      {/* Main Content Area */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            lang={lang}
            activeField={activeField}
            farmHealth={farmHealth}
            recentAlerts={alerts}
            latestLeaf={leafPredictions[0] || null}
            latestSoil={soilReadings[0] || null}
            latestPest={pestAssessments[0] || null}
            onNavigate={setCurrentTab}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            isIoTRunning={isIoTRunning}
            onOpenIoTModal={() => setIsIoTModalOpen(true)}
            currentFarmer={currentFarmer}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {currentTab === 'cropSoilExplorer' && (
          <CropSoilExplorer
            lang={lang}
            onSelectCropForTesting={(crop) => {
              setPreselectedCrop(crop);
              setCurrentTab('soilAssessment');
            }}
            onSelectSoilPreset={(soilId) => {
              setPreselectedSoilId(soilId);
              setCurrentTab('soilAssessment');
            }}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'cropHealth' && (
          <CropHealthModule
            lang={lang}
            activeField={activeField}
            onSavePrediction={handleSavePrediction}
            recentPredictions={leafPredictions}
          />
        )}

        {currentTab === 'soilAssessment' && (
          <SoilAssessmentModule
            lang={lang}
            activeField={activeField}
            onSaveReading={handleSaveSoilReading}
            latestIoTData={latestIoTData}
            isIoTRunning={isIoTRunning}
            preselectedSoilPresetId={preselectedSoilId}
            preselectedCrop={preselectedCrop}
          />
        )}

        {currentTab === 'pestRisk' && (
          <PestRiskModule
            lang={lang}
            activeField={activeField}
            onSaveAssessment={handleSavePestAssessment}
          />
        )}

        {currentTab === 'analytics' && (
          <HistoryAndCharts
            lang={lang}
            activeField={activeField}
            leafPredictions={leafPredictions}
            soilReadings={soilReadings}
            pestAssessments={pestAssessments}
          />
        )}

        {currentTab === 'techDocs' && (
          <TechDocsAndMetrics lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--pastel-border,#d4e5da)] bg-[var(--pastel-card,white)] py-6 text-xs text-[var(--pastel-text-muted,#587564)] shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--pastel-text-title,#142d1f)]">AgriSense AI Platform</span>
            <span>•</span>
            <span>PlantVillage CNN + Kaggle ML + LoRa Edge IoT</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--pastel-text-muted,#587564)]">
            <span>Languages: EN • हिन्दी • मराठी</span>
            <span>•</span>
            <span>Pastel Agri-Intelligence</span>
            <span>•</span>
            <span>Live Open-Meteo API</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IoTSimulatorModal
        isOpen={isIoTModalOpen}
        onClose={() => setIsIoTModalOpen(false)}
        lang={lang}
        isRunning={isIoTRunning}
        onToggleRunning={() => setIsIoTRunning(!isIoTRunning)}
        latestReadings={latestIoTData}
        packetCount={packetCount}
        onApplyToSoil={() => {
          setCurrentTab('soilAssessment');
          setIsIoTModalOpen(false);
        }}
      />

      <AlertsPanel
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        lang={lang}
        alerts={alerts}
        onMarkRead={handleMarkAlertRead}
        onNavigate={setCurrentTab}
      />

      <NewFieldModal
        isOpen={isNewFieldOpen}
        onClose={() => setIsNewFieldOpen(false)}
        lang={lang}
        onSaveField={handleSaveNewField}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        onLoginSuccess={handleLoginSuccess}
      />

      {currentFarmer && (
        <FarmerProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          lang={lang}
          farmer={currentFarmer}
          onUpdateFarmer={handleUpdateFarmer}
          onLogout={handleLogout}
          onOpenSwitchAccount={() => setIsAuthModalOpen(true)}
        />
      )}

      <FarmerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
        onNavigateToTab={(tab) => {
          setCurrentTab(tab);
          setIsGuideOpen(false);
        }}
      />
    </div>
  );
}
