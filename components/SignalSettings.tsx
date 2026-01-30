
import React from 'react';
import { SignalPreset, SignalConfig } from '../types';

interface Props {
  config: SignalConfig;
  onChange: (config: SignalConfig) => void;
}

const SignalSettings: React.FC<Props> = ({ config, onChange }) => {
  const update = (key: keyof SignalConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* N Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Number of Samples (N)</label>
        <div className="grid grid-cols-4 gap-2">
          {[8, 16, 32, 64, 128, 256].map(n => (
            <button 
              key={n}
              onClick={() => update('N', n)}
              className={`py-1.5 rounded-md text-xs font-bold transition-colors ${config.N === n ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Signal Preset</label>
        <select 
          value={config.preset}
          onChange={(e) => update('preset', e.target.value as SignalPreset)}
          className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          {Object.values(SignalPreset).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Tone Controls (Conditional) */}
      {(config.preset === SignalPreset.SINGLE_TONE || config.preset === SignalPreset.TWO_TONES || config.preset === SignalPreset.CHIRP) && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tone 1 Frequency</span>
                <span className="text-xs font-mono text-blue-600">{config.f1} Hz</span>
             </div>
             <input 
              type="range" min="0" max={config.N / 2} step="0.5" 
              value={config.f1} 
              onChange={(e) => update('f1', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tone 1 Amplitude</span>
                <span className="text-xs font-mono text-blue-600">{config.a1}</span>
             </div>
             <input 
              type="range" min="0.1" max="2" step="0.1" 
              value={config.a1} 
              onChange={(e) => update('a1', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}

      {config.preset === SignalPreset.TWO_TONES && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tone 2 Frequency</span>
                <span className="text-xs font-mono text-indigo-600">{config.f2} Hz</span>
             </div>
             <input 
              type="range" min="0" max={config.N / 2} step="0.5" 
              value={config.f2} 
              onChange={(e) => update('f2', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tone 2 Amplitude</span>
                <span className="text-xs font-mono text-indigo-600">{config.a2}</span>
             </div>
             <input 
              type="range" min="0.1" max="2" step="0.1" 
              value={config.a2} 
              onChange={(e) => update('a2', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalSettings;
