
import React, { useMemo } from 'react';
import { ComplexNumber, ButterflyData } from '../types';
import { Complex } from '../utils/math';

interface Props {
  N: number;
  input: ComplexNumber[];
  reordered: ComplexNumber[];
  stages: ComplexNumber[][];
  butterflies: ButterflyData[][];
  activeStage: number; // 0 = bit-reverse, 1..log2N = computation stages
  activeButterflyIndex: number; // -1 for none
  teacherMode: boolean;
}

const ButterflyVisualizer: React.FC<Props> = ({
  N,
  input,
  reordered,
  stages,
  butterflies,
  activeStage,
  activeButterflyIndex,
  teacherMode
}) => {
  const logN = Math.log2(N);
  const stageWidth = 240;
  const nodeRadius = 6;
  const padding = 80;
  const rowHeight = 50;
  const totalWidth = (logN + 2) * stageWidth + padding * 2;
  const totalHeight = N * rowHeight + padding * 2;

  const bitReverseMap = useMemo(() => {
    const map = new Array(N);
    const bits = Math.log2(N);
    for (let i = 0; i < N; i++) {
      let reversed = 0;
      let temp = i;
      for (let b = 0; b < bits; b++) {
        reversed = (reversed << 1) | (temp & 1);
        temp >>= 1;
      }
      map[i] = reversed;
    }
    return map;
  }, [N]);

  // Calculate live operation counts for the current animation step
  const liveOps = useMemo(() => {
    if (activeStage === 0) return { mults: 0, adds: 0 };

    const completedStages = activeStage - 1;
    const bfsPerStage = N / 2;

    // Each completed stage has N/2 butterflies. Each BF has 1 mult and 2 additions.
    let mults = completedStages * bfsPerStage;
    let adds = completedStages * N;

    // Add operations from the current active stage
    if (activeButterflyIndex !== -1) {
      mults += (activeButterflyIndex + 1);
      adds += (activeButterflyIndex + 1) * 2;
    }

    return { mults, adds };
  }, [activeStage, activeButterflyIndex, N]);

  if (N > 32) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <div>
          <i className="fas fa-search-minus text-4xl text-slate-400 mb-4"></i>
          <p className="text-slate-600 font-medium">Butterfly diagram is hidden for N &gt; 32</p>
          <p className="text-sm text-slate-400">Diagram complexity grows O(N log N). Please select N=8 or N=16 for detailed visualization.</p>
        </div>
      </div>
    );
  }

  // Visual constants for highlighting
  const INACTIVE_COLOR = "#cbd5e1";
  const STAGE_ACTIVE_COLOR = "#64748b";
  const HIGHLIGHT_COLOR = "#f59e0b"; // Vibrant Amber/Orange for the active butterfly
  const HIGHLIGHT_STROKE = 3.5;

  return (
    <div className="overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm h-full relative">
      <svg width={totalWidth} height={totalHeight} className="mx-auto">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={HIGHLIGHT_COLOR} />
          </marker>
        </defs>

        {/* Header Titles */}
        <text x={padding + 20} y={40} className="text-sm font-bold fill-slate-500 uppercase tracking-widest">Input x[n]</text>
        <text x={padding + stageWidth + 20} y={40} className="text-sm font-bold fill-slate-500 uppercase tracking-widest">Bit Reversed</text>
        {Array.from({ length: logN }).map((_, i) => (
          <text key={i} x={padding + (i + 2) * stageWidth + 20} y={40} className="text-sm font-bold fill-slate-500 uppercase tracking-widest">Stage {i + 1}</text>
        ))}
        <text x={padding + (logN + 2) * stageWidth - 10} y={40} className="text-sm font-bold fill-slate-500 uppercase tracking-widest">Output X[k]</text>

        {/* Input Connections */}
        {Array.from({ length: N }).map((_, rowIndex) => {
          const y = padding + rowIndex * rowHeight;
          const xInput = padding;
          const xReorder = padding + stageWidth;
          const reversedIndex = bitReverseMap[rowIndex];
          const yReorder = padding + reversedIndex * rowHeight;
          const isBitReverseActive = activeStage === 0;

          return (
            <g key={`row-${rowIndex}`}>
              <text x={xInput - 20} y={y + 5} textAnchor="end" className="text-[11px] fill-slate-400 code-font font-bold">[{rowIndex}]</text>
              <circle cx={xInput} cy={y} r={nodeRadius} fill="#cbd5e1" />
              <line
                x1={xInput} y1={y} x2={xReorder} y2={yReorder}
                stroke={isBitReverseActive ? HIGHLIGHT_COLOR : INACTIVE_COLOR}
                strokeWidth={isBitReverseActive ? HIGHLIGHT_STROKE : 1}
                strokeDasharray={isBitReverseActive ? "0" : "4 2"}
                markerEnd={isBitReverseActive ? "url(#arrow-active)" : "url(#arrow)"}
              />
              <circle cx={xReorder} cy={yReorder} r={nodeRadius} fill="#94a3b8" />
              <text x={xReorder + 15} y={yReorder + 5} className="text-[11px] fill-slate-600 font-bold">x[{rowIndex}]</text>
            </g>
          );
        })}

        {/* FFT Stages */}
        {butterflies.map((stageButterflies, stageIdx) => {
          const s = stageIdx + 1;
          const xStart = padding + s * stageWidth;
          const xEnd = padding + (s + 1) * stageWidth;
          const isStageActive = activeStage === s;

          return (
            <g key={`stage-${s}`}>
              {/* Lines Layer */}
              {stageButterflies.map((bf, bfIdx) => {
                const yA = padding + bf.indexA * rowHeight;
                const yB = padding + bf.indexB * rowHeight;
                const isActive = isStageActive && (activeButterflyIndex === -1 || activeButterflyIndex === bfIdx);
                const strokeColor = isActive ? HIGHLIGHT_COLOR : (isStageActive ? STAGE_ACTIVE_COLOR : INACTIVE_COLOR);
                const strokeWidth = isActive ? HIGHLIGHT_STROKE : 1.2;

                return (
                  <React.Fragment key={`bf-lines-${bfIdx}`}>
                    <line x1={xStart} y1={yA} x2={xEnd} y2={yA} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"} />
                    <line x1={xStart} y1={yB} x2={xEnd} y2={yB} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"} />
                    <line x1={xStart} y1={yB} x2={xEnd} y2={yA} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"} />
                    <line x1={xStart} y1={yA} x2={xEnd} y2={yB} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"} />
                  </React.Fragment>
                );
              })}

              {/* Labels Layer */}
              {(teacherMode || isStageActive) && stageButterflies.map((bf, bfIdx) => {
                const yB = padding + bf.indexB * rowHeight;
                const isActive = isStageActive && (activeButterflyIndex === -1 || activeButterflyIndex === bfIdx);

                return (
                  <g key={`bf-labels-${bfIdx}`} className="pointer-events-none select-none">
                    <g transform={`translate(${xStart + 35}, ${yB - 14})`}>
                      <rect
                        x="-4" y="-14" width="48" height="20" rx="4"
                        fill="white" fillOpacity="1"
                        stroke={isActive ? HIGHLIGHT_COLOR : "#94a3b8"}
                        strokeWidth={isActive ? "2" : "0.5"}
                      />
                      <text
                        x="4" y="2"
                        className={`text-[13px] font-black ${isActive ? 'fill-amber-700' : 'fill-slate-600'}`}
                      >
                        W<tspan dy="3" fontSize="9">{bf.twiddleN}</tspan><tspan dy="-3" fontSize="9">{bf.twiddleK}</tspan>
                      </text>
                    </g>

                    <g transform={`translate(${xEnd - 40}, ${yB - 10})`}>
                      <rect x="-2" y="-12" width="22" height="18" rx="3" fill="white" fillOpacity="0.8" />
                      <text
                        x="0" y="2"
                        className={`text-[14px] font-black ${isActive ? 'fill-red-600' : 'fill-slate-500'}`}
                      >
                        -1
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes Layer */}
              {stageButterflies.map((bf, bfIdx) => {
                const yA = padding + bf.indexA * rowHeight;
                const yB = padding + bf.indexB * rowHeight;
                const isActive = isStageActive && (activeButterflyIndex === -1 || activeButterflyIndex === bfIdx);
                return (
                  <React.Fragment key={`bf-nodes-${bfIdx}`}>
                    <circle cx={xEnd} cy={yA} r={nodeRadius} fill={isActive ? HIGHLIGHT_COLOR : (isStageActive ? STAGE_ACTIVE_COLOR : INACTIVE_COLOR)} />
                    <circle cx={xEnd} cy={yB} r={nodeRadius} fill={isActive ? HIGHLIGHT_COLOR : (isStageActive ? STAGE_ACTIVE_COLOR : INACTIVE_COLOR)} />
                  </React.Fragment>
                );
              })}
            </g>
          );
        })}
        {/* Output Labels */}
        {Array.from({ length: N }).map((_, rowIndex) => {
          const y = padding + rowIndex * rowHeight;
          const xEnd = padding + (logN + 1) * stageWidth;
          const isActive = activeStage === logN + 1 || (activeStage === logN && activeButterflyIndex === -1); // Highlight when complete

          return (
            <text
              key={`out-${rowIndex}`}
              x={xEnd + 15}
              y={y + 5}
              className={`text-[12px] font-bold code-font ${isActive ? 'fill-blue-600' : 'fill-slate-500'}`}
            >
              X[{rowIndex}]
            </text>
          );
        })}
      </svg>

      {/* Floating Operations Counter Panel */}
      <div className="absolute bottom-6 left-6 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-white">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-calculator text-blue-400"></i>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Operation Counter</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Complex Mults</div>
              <div className="text-xl font-mono text-blue-400 font-bold">{liveOps.mults}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Complex Adds</div>
              <div className="text-xl font-mono text-emerald-400 font-bold">{liveOps.adds}</div>
            </div>
          </div>
          {activeStage > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
              Each butterfly adds 1 mult and 2 adds.
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-2">
        {!teacherMode && activeStage === 0 && (
          <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg border border-blue-500 flex items-center gap-3">
            <i className="fas fa-info-circle"></i>
            <p className="text-sm font-bold">Enable "TEACHER MODE" to see all twiddle factors permanently.</p>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 max-w-xs space-y-2 pointer-events-none">
        {activeStage === 0 && (
          <div className="bg-blue-50/95 backdrop-blur-sm border border-blue-200 p-4 rounded-xl shadow-lg animate-pulse">
            <h4 className="text-blue-700 font-bold text-base">Bit-Reversal Reordering</h4>
            <p className="text-blue-600 text-xs mt-1">Arranges indices x[n] so that the butterfly stages can compute the result in-place efficiently.</p>
          </div>
        )}
        {activeStage > 0 && (
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-xl shadow-lg">
            <h4 className="text-slate-700 font-bold text-base">FFT Stage {activeStage}</h4>
            <p className="text-slate-600 text-xs mt-1">
              Multiplying by twiddle factors rotate the complex vectors of the "odd" branch before summation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButterflyVisualizer;
