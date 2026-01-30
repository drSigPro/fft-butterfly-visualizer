
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { ComplexNumber } from '../types';
import { Complex } from '../utils/math';

interface Props {
  input: ComplexNumber[];
  output: ComplexNumber[];
  showPhase: boolean;
}

const ComparisonCharts: React.FC<Props> = ({ input, output, showPhase }) => {
  const timeData = input.map((val, i) => ({ n: i, val: val.re }));
  const spectrumData = output.map((val, i) => {
    const mag = Complex.magnitude(val);
    const phase = Complex.phase(val);
    return { 
      k: i, 
      mag: Number(mag.toFixed(4)), 
      phase: Number(phase.toFixed(4)) 
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Time Domain */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Time Domain: x[n]</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="n" fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Magnitude Spectrum */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">
          {showPhase ? 'Phase Spectrum: ∠X[k]' : 'Magnitude Spectrum: |X[k]|'}
        </h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spectrumData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="k" fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              {showPhase ? (
                <Bar dataKey="phase" fill="#ec4899" radius={[4, 4, 0, 0]} />
              ) : (
                <Bar dataKey="mag" fill="#10b981" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCharts;
