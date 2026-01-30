
import React from 'react';
import { ComputationStats } from '../types';

interface Props {
  N: number;
  stats: ComputationStats;
}

const StatsPanel: React.FC<Props> = ({ N, stats }) => {
  const dftTotal = stats.dftOps.mults + stats.dftOps.adds;
  const fftTotal = stats.fftOps.mults + stats.fftOps.adds;
  const speedupFactor = (dftTotal / fftTotal).toFixed(1);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl border border-slate-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <i className="fas fa-microchip text-blue-400"></i>
          Computation Metrics (N={N})
        </h3>
        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {speedupFactor}x Efficiency
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* DFT Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase mb-1">Direct DFT</span>
            <span className="text-slate-500 text-[10px] mb-2 font-mono">O(N²) Complexity</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-400">Complex Mults</span>
              <span className="font-mono text-blue-300">{stats.dftOps.mults.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-400">Complex Adds</span>
              <span className="font-mono text-blue-300">{stats.dftOps.adds.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <span>Median Runtime</span>
              <span className="font-mono text-emerald-400">{stats.dftTime.toFixed(4)}ms</span>
            </div>
          </div>
        </div>

        {/* FFT Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase mb-1">Fast Fourier (FFT)</span>
            <span className="text-slate-500 text-[10px] mb-2 font-mono">O(N log₂N) Complexity</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-400">Complex Mults</span>
              <span className="font-mono text-emerald-300">{stats.fftOps.mults.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
              <span className="text-slate-400">Complex Adds</span>
              <span className="font-mono text-emerald-300">{stats.fftOps.adds.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <span>Median Runtime</span>
              <span className="font-mono text-emerald-400">{stats.fftTime.toFixed(4)}ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <p className="text-slate-400 text-xs italic leading-relaxed">
          The FFT avoids redundant calculations by breaking down the DFT into smaller sub-problems recursively. 
          For N={N}, the complexity drop is from {dftTotal.toLocaleString()} ops to {fftTotal.toLocaleString()} ops.
        </p>
      </div>
    </div>
  );
};

export default StatsPanel;
