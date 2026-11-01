import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  Layers, 
  Sliders, 
  Save, 
  RefreshCw,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Field, Language, LeafPrediction } from '../types';
import { translations } from '../i18n/translations';
import { speakText, stopSpeech } from '../utils/speech';
import { 
  DISEASE_DATABASE, 
  PRESET_SAMPLES, 
  renderGradCamToCanvas, 
  runLeafCnnInference 
} from '../utils/gradCam';

interface CropHealthModuleProps {
  lang: Language;
  activeField: Field;
  onSavePrediction: (pred: LeafPrediction) => void;
  recentPredictions: LeafPrediction[];
}

export const CropHealthModule: React.FC<CropHealthModuleProps> = ({
  lang,
  activeField,
  onSavePrediction,
  recentPredictions,
}) => {
  const t = translations[lang];
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_SAMPLES[0].previewUrl);
  const [activePresetKey, setActivePresetKey] = useState<string>(PRESET_SAMPLES[0].key);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<LeafPrediction | null>(null);

  // Grad-CAM controls
  const [gradCamOpacity, setGradCamOpacity] = useState<number>(0.65);
  const [colormap, setColormap] = useState<'jet' | 'turbo' | 'inferno' | 'viridis'>('jet');
  const [showContours, setShowContours] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSpeakTreatment = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }
    if (!prediction) return;

    let text = '';
    if (lang === 'hi') {
      text = `पहचाना गया रोग: ${prediction.diseaseName}। रोग प्रकार: ${prediction.pathogenType}। विश्वस्तता: ${(prediction.confidence * 100).toFixed(0)} प्रतिशत। `;
      text += `रासायनिक दवा: ${prediction.treatment.chemical.join(', ')}। `;
      text += `जैविक देसी उपचार: ${prediction.treatment.organic.join(', ')}। `;
      text += `दीर्घकालिक बचाव: ${prediction.treatment.prevention.join(', ')}।`;
    } else if (lang === 'mr') {
      text = `ओळखलेला रोग: ${prediction.diseaseName}। प्रकार: ${prediction.pathogenType}। अचूकता: ${(prediction.confidence * 100).toFixed(0)} टक्के। `;
      text += `रासायनिक उपाय: ${prediction.treatment.chemical.join(', ')}। `;
      text += `सेंद्रिय उपाय: ${prediction.treatment.organic.join(', ')}। `;
      text += `दीर्घकालीन काळजी: ${prediction.treatment.prevention.join(', ')}।`;
    } else {
      text = `Diagnosed disease: ${prediction.diseaseName}. Pathogen type: ${prediction.pathogenType}. Confidence: ${(prediction.confidence * 100).toFixed(0)} percent. `;
      text += `Chemical treatment: ${prediction.treatment.chemical.join(', ')}. `;
      text += `Organic remedies: ${prediction.treatment.organic.join(', ')}. `;
      text += `Prevention guidelines: ${prediction.treatment.prevention.join(', ')}.`;
    }

    setIsPlayingAudio(true);
    speakText(text, lang, () => setIsPlayingAudio(false));
  };

  // Initial inference on load
  useEffect(() => {
    handleRunInference(selectedImage, activePresetKey);
  }, []);

  // Re-render Grad-CAM when parameters change
  useEffect(() => {
    if (canvasRef.current && imageRef.current && prediction) {
      const hotspots = DISEASE_DATABASE[activePresetKey]?.sampleHotspots || [prediction.gradCamMetrics.primaryHotspot];
      if (imageRef.current.complete) {
        renderGradCamToCanvas(
          canvasRef.current,
          imageRef.current,
          hotspots,
          gradCamOpacity,
          colormap,
          showContours
        );
      } else {
        imageRef.current.onload = () => {
          if (canvasRef.current && imageRef.current) {
            renderGradCamToCanvas(
              canvasRef.current,
              imageRef.current,
              hotspots,
              gradCamOpacity,
              colormap,
              showContours
            );
          }
        };
      }
    }
  }, [prediction, gradCamOpacity, colormap, showContours, selectedImage]);

  const handleRunInference = async (imgUrl: string, presetKey?: string) => {
    setIsAnalyzing(true);
    setSavedSuccess(false);
    try {
      // Simulate realistic CNN MobileNetV2 latency
      await new Promise(res => setTimeout(res, 500));
      const res = await runLeafCnnInference(imgUrl, activeField.id, activeField.name, presetKey);
      setPrediction(res);
    } catch (err) {
      console.error('Inference error', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setSelectedImage(preset.previewUrl);
    setActivePresetKey(preset.key);
    handleRunInference(preset.previewUrl, preset.key);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setSelectedImage(url);
        setActivePresetKey('');
        handleRunInference(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToRecord = () => {
    if (prediction) {
      onSavePrediction(prediction);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Module 1: Computer Vision & Pathology</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-1">
              {t.cropModule.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {t.cropModule.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Field:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              {activeField.name} ({activeField.cropType})
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Presets (Left) + Grad-CAM & Diagnosis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input, Upload & Presets */}
        <div className="lg:col-span-5 space-y-5">
          {/* File Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-700/50 hover:border-emerald-500 bg-[#122218]/60 hover:bg-[#122218] rounded-2xl p-6 text-center cursor-pointer transition-all group shadow-inner"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-3">
              {t.cropModule.dropzoneTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.cropModule.dropzoneDesc}
            </p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              JPG, PNG, WebP up to 10MB
            </span>
          </div>

          {/* PlantVillage Verified Preset Gallery */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{t.cropModule.presetPrompt}</span>
              <span className="text-[10px] text-emerald-400 font-mono">PlantVillage DB</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_SAMPLES.map((sample) => {
                const isSelected = activePresetKey === sample.key;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectPreset(sample)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-emerald-900/40 border-emerald-500 ring-1 ring-emerald-500/50 text-slate-100'
                        : 'bg-[#14231b] border-emerald-900/50 text-slate-400 hover:border-emerald-700/60 hover:text-slate-200'
                    }`}
                  >
                    <img 
                      src={sample.previewUrl} 
                      alt={sample.name} 
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-emerald-950"
                      crossOrigin="anonymous"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{sample.name}</p>
                      <p className="text-[11px] text-emerald-400/80">{sample.crop}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hidden reference img for canvas processing */}
          <img 
            ref={imageRef} 
            src={selectedImage} 
            alt="Source leaf" 
            className="hidden" 
            crossOrigin="anonymous"
          />

          {/* Grad-CAM Controls Card */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Grad-CAM Heatmap Controls
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                ReLU(Σ α_k A^k)
              </span>
            </div>

            {/* Opacity slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{t.cropModule.gradCamOpacity}</span>
                <span className="font-mono text-emerald-300">{Math.round(gradCamOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={gradCamOpacity}
                onChange={(e) => setGradCamOpacity(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Colormap scheme */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{t.cropModule.gradCamColormap}</label>
                <select
                  value={colormap}
                  onChange={(e) => setColormap(e.target.value as any)}
                  className="w-full bg-[#16271e] border border-emerald-900/70 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="jet">Jet (Standard Thermal)</option>
                  <option value="turbo">Turbo (Google Smooth)</option>
                  <option value="inferno">Inferno (Perceptual)</option>
                  <option value="viridis">Viridis (High Contrast)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lesion Contour</label>
                <button
                  onClick={() => setShowContours(!showContours)}
                  className={`w-full py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                    showContours 
                      ? 'bg-emerald-900/40 border-emerald-600 text-emerald-300' 
                      : 'bg-[#16271e] border-emerald-900/70 text-slate-400'
                  }`}
                >
                  {showContours ? '✓ Hotspots Visible' : 'Contours Hidden'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer & Diagnostic Assessment */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Visualizer Canvas */}
          <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-4 overflow-hidden relative shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {t.cropModule.gradCamTitle}
                </h3>
              </div>
              {prediction && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Coverage:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                    {prediction.gradCamMetrics.lesionCoveragePct}%
                  </span>
                </div>
              )}
            </div>

            {/* Canvas Container */}
            <div className="relative aspect-4/3 w-full bg-[#0a110d] rounded-xl overflow-hidden flex items-center justify-center border border-emerald-950">
              {isAnalyzing && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-xs font-semibold">{t.cropModule.analyzing}</p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Explainability Legend Bar */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#14231b] border border-emerald-900/50 flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Attention Scale:</span>
                <div className="h-2.5 w-24 rounded bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 border border-slate-700"></div>
                <span className="text-[10px] text-slate-400">Low → Peak Attention</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                {t.cropModule.gradCamDesc}
              </p>
            </div>
          </div>

          {/* CNN Prediction Assessment Card */}
          {prediction && (
            <div className="bg-[#111e16] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                    {t.cropModule.detectedDisease}
                  </span>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-100 flex items-center gap-2">
                    {prediction.diseaseName}
                    {prediction.pathogenType === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                  </h2>
                  {prediction.scientificName && (
                    <p className="text-xs text-slate-400 italic font-mono">
                      {prediction.scientificName}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">{t.cropModule.confidenceScore}</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </div>
                  <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-1 ${
                    prediction.severity === 'Severe' ? 'bg-[#fdeeed] text-[#b42b30] border border-[#f8c6c8]' :
                    prediction.severity === 'High' ? 'bg-[#fef4e8] text-[#9c5415] border border-[#fed9b3]' :
                    prediction.severity === 'Moderate' ? 'bg-[#fef9e7] text-[#8f6d19] border border-[#fae69e]' :
                    'bg-[#e6f4ec] text-[#1b5e37] border border-[#bce2cb]'
                  }`}>
                    {prediction.severity} Severity
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Top Probabilities Distribution */}
              <div className="bg-[#14231b] rounded-xl p-3 border border-emerald-900/40">
                <h4 className="text-xs font-semibold text-slate-300 mb-2">
                  {t.cropModule.topProbabilities}
                </h4>
                <div className="space-y-1.5">
                  {prediction.topPredictions.map((pred, i) => (
                    <div key={i} className="flex items-center text-xs justify-between gap-3">
                      <span className="text-slate-300 truncate max-w-[200px]">
                        {pred.diseaseName}
                      </span>
                      <div className="flex items-center gap-2 grow max-w-[140px]">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${i === 0 ? 'bg-emerald-500' : 'bg-slate-600'}`}
                            style={{ width: `${pred.score * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 w-10 text-right">
                          {(pred.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Protocols */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--pastel-text-title,#142d1f)]">
                    {t.cropModule.treatmentPlan}
                  </h4>
                  <div className="flex items-center gap-2">
                    {/* Audio Listen Button */}
                    <button
                      onClick={handleSpeakTreatment}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                        isPlayingAudio
                          ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                          : 'bg-[var(--pastel-accent-light,#e4f4ec)] hover:bg-[var(--pastel-accent-border,#bce3cb)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)]'
                      }`}
                      title="Listen to Diagnosis and Treatment"
                    >
                      {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>
                        {isPlayingAudio
                          ? (lang === 'hi' ? 'रोकें' : lang === 'mr' ? 'थांबवा' : 'Stop')
                          : (lang === 'hi' ? '🔊 उपचार सुनें' : lang === 'mr' ? '🔊 उपाय ऐका' : '🔊 Listen')}
                      </span>
                    </button>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Urgency: {prediction.treatment.urgency}
                    </span>
                  </div>
                </div>

                {/* Chemical Options */}
                <div className="p-3 rounded-xl bg-[#14231b] border border-emerald-900/40">
                  <p className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.cropModule.chemicalHeader}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {prediction.treatment.chemical.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Organic & Cultural Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#14231b] border border-emerald-900/40">
                    <p className="text-xs font-semibold text-green-400 mb-1">
                      🌿 {t.cropModule.organicHeader}
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {prediction.treatment.organic.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14231b] border border-emerald-900/40">
                    <p className="text-xs font-semibold text-lime-400 mb-1">
                      🛡️ {t.cropModule.preventionHeader}
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {prediction.treatment.prevention.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/40">
                <span className="text-xs text-slate-400">
                  Logged for Field: <strong className="text-slate-200">{activeField.name}</strong>
                </span>
                <button
                  onClick={handleSaveToRecord}
                  disabled={savedSuccess}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Saved to History & Alerts Updated!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Diagnosis to Field History
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
