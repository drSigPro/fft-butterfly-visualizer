
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SignalPreset, SignalConfig, ComplexNumber, ComputationStats,
  ButterflyData
} from './types';
import { generateSignal } from './utils/signal';
import {
  getDFT, getFFTStages, calculateOpCounts, benchmarkComputation
} from './utils/fft';
import { Complex } from './utils/math';
import SignalSettings from './components/SignalSettings';
import ButterflyVisualizer from './components/ButterflyVisualizer';
import ComparisonCharts from './components/ComparisonCharts';
import StatsPanel from './components/StatsPanel';

const App: React.FC = () => {
  // --- State ---
  const [config, setConfig] = useState<SignalConfig>(() => {
    // Initial config from URL or defaults
    const params = new URLSearchParams(window.location.hash.slice(1));
    const nParam = parseInt(params.get('N') || '16');
    const N = [2, 4, 8, 16, 32].includes(nParam) ? nParam : 16;
    return {
      N,
      preset: (params.get('preset') as SignalPreset) || SignalPreset.TWO_TONES,
      f1: parseFloat(params.get('f1') || '2'),
      a1: parseFloat(params.get('a1') || '1'),
      p1: parseFloat(params.get('p1') || '0'),
      f2: parseFloat(params.get('f2') || '5'),
      a2: parseFloat(params.get('a2') || '0.5'),
      p2: parseFloat(params.get('p2') || '0'),
    };
  });

  const [inputSignal, setInputSignal] = useState<ComplexNumber[]>([]);
  const [outputSignal, setOutputSignal] = useState<ComplexNumber[]>([]);
  const [fftData, setFftData] = useState<{
    reordered: ComplexNumber[];
    stages: ComplexNumber[][];
    butterflies: ButterflyData[][];
  } | null>(null);

  const [stats, setStats] = useState<ComputationStats | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeButterfly, setActiveButterfly] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);
  const [teacherMode, setTeacherMode] = useState(false);
  const [showPhase, setShowPhase] = useState(false);

  // --- Calculations ---
  useEffect(() => {
    const signal = generateSignal(config);
    setInputSignal(signal);

    const result = getFFTStages(signal);
    setFftData(result);
    setOutputSignal(result.stages[result.stages.length - 1]);

    // Update URL hash
    const params = new URLSearchParams();
    Object.entries(config).forEach(([k, v]) => params.set(k, v.toString()));
    window.location.hash = params.toString();

    // Benchmark
    const dftTime = benchmarkComputation(signal, getDFT);
    const fftTime = benchmarkComputation(signal, (s) => getFFTStages(s));
    const opCounts = calculateOpCounts(config.N);

    setStats({
      dftTime,
      fftTime,
      dftOps: opCounts.dft,
      fftOps: opCounts.fft
    });

    // Reset animation
    setActiveStage(0);
    setActiveButterfly(-1);
    setIsPlaying(false);
  }, [config]);

  // --- Animation Core Logic ---
  const stepForward = useCallback(() => {
    if (!fftData) return;
    const numStages = fftData.butterflies.length;

    if (activeStage === 0) {
      setActiveStage(1);
      setActiveButterfly(0);
    } else {
      const currentStageBfs = fftData.butterflies[activeStage - 1].length;
      if (activeButterfly < currentStageBfs - 1) {
        setActiveButterfly(prev => prev + 1);
      } else if (activeStage < numStages) {
        setActiveStage(prev => prev + 1);
        setActiveButterfly(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [activeStage, activeButterfly, fftData]);

  const stepBackward = useCallback(() => {
    if (!fftData) return;
    if (activeStage === 0) return;

    if (activeButterfly > 0) {
      setActiveButterfly(prev => prev - 1);
    } else if (activeStage > 1) {
      const prevStageIdx = activeStage - 2;
      const prevStageBfs = fftData.butterflies[prevStageIdx].length;
      setActiveStage(prev => prev - 1);
      setActiveButterfly(prevStageBfs - 1);
    } else {
      setActiveStage(0);
      setActiveButterfly(-1);
    }
  }, [activeStage, activeButterfly, fftData]);

  // --- Playback Loop ---
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(stepForward, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, stepForward]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Configuration link copied to clipboard!');
  };

  const resetAll = () => {
    setConfig({
      N: 16,
      preset: SignalPreset.SINGLE_TONE,
      f1: 2, a1: 1, p1: 0,
      f2: 5, a2: 0, p2: 0
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-wave-square text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FFT Explorer <span className="text-blue-400 font-light">DIT Radix-2</span></h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Interactive DSP Educator</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTeacherMode(!teacherMode)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${teacherMode ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
          >
            <i className="fas fa-graduation-cap mr-2"></i>
            TEACHER MODE
          </button>
          <button onClick={handleShare} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-share-alt"></i>
          </button>
          <button onClick={resetAll} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-undo"></i>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Sidebar: Controls */}
        <aside className="col-span-12 lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Signal Configuration</h2>
            <SignalSettings config={config} onChange={setConfig} />
          </section>

          {stats && <StatsPanel N={config.N} stats={stats} />}

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Animation Controls</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button onClick={stepBackward} className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <i className="fas fa-step-backward"></i>
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button onClick={stepForward} className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <i className="fas fa-step-forward"></i>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                  Speed <span>{playbackSpeed}ms</span>
                </label>
                <input
                  type="range" min="100" max="2000" step="100"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Stage: {activeStage === 0 ? 'Bit-Reverse' : activeStage}</span>
                <span className="text-xs font-medium text-slate-500">
                  BF: {activeButterfly === -1 ? 'None' : activeButterfly + 1}
                </span>
              </div>
            </div>
          </section>
        </aside>

        {/* Content: Visualizer and Charts */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full overflow-hidden">
          {/* Top Row: Butterfly Diagram */}
          <div className="flex-[3] min-h-[400px]">
            {fftData && (
              <ButterflyVisualizer
                N={config.N}
                input={inputSignal}
                reordered={fftData.reordered}
                stages={fftData.stages}
                butterflies={fftData.butterflies}
                activeStage={activeStage}
                activeButterflyIndex={activeButterfly}
                teacherMode={teacherMode}
              />
            )}
          </div>

          {/* Bottom Row: Charts */}
          <div className="flex-[2] relative min-h-[250px]">
            <div className="absolute top-2 right-4 z-10 flex gap-2">
              <button
                onClick={() => setShowPhase(!showPhase)}
                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${showPhase ? 'bg-pink-100 border-pink-200 text-pink-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
              >
                {showPhase ? 'MAGNITUDE VIEW' : 'PHASE VIEW'}
              </button>
            </div>
            <ComparisonCharts input={inputSignal} output={outputSignal} showPhase={showPhase} />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      {teacherMode && (
        <footer className="bg-amber-50 border-t border-amber-200 px-8 py-3 flex gap-8">
          <div className="flex items-center gap-2 text-amber-800 text-xs">
            <span className="font-bold">MATH:</span>
            <code className="bg-amber-100 px-2 py-0.5 rounded">a' = a + W_N^k b</code>
            <code className="bg-amber-100 px-2 py-0.5 rounded">b' = a - W_N^k b</code>
          </div>
          <div className="flex items-center gap-2 text-amber-800 text-xs">
            <span className="font-bold">DIT Property:</span>
            <span>Splits input index x[n] into even/odd sequences.</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
