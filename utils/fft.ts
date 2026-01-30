
import { ComplexNumber, ButterflyData } from '../types';
import { Complex } from './math';

export const bitReverse = (n: number, bits: number): number => {
  let reversed = 0;
  for (let i = 0; i < bits; i++) {
    reversed = (reversed << 1) | (n & 1);
    n >>= 1;
  }
  return reversed;
};

export const getDFT = (x: ComplexNumber[]): ComplexNumber[] => {
  const N = x.length;
  const X: ComplexNumber[] = new Array(N);
  for (let k = 0; k < N; k++) {
    let sum = Complex.from(0, 0);
    for (let n = 0; n < N; n++) {
      const W = Complex.twiddle(k * n, N);
      sum = Complex.add(sum, Complex.mul(x[n], W));
    }
    X[k] = sum;
  }
  return X;
};

export const getFFTStages = (x: ComplexNumber[]): {
  reordered: ComplexNumber[];
  stages: ComplexNumber[][];
  butterflies: ButterflyData[][];
} => {
  const N = x.length;
  const bits = Math.log2(N);
  
  // Bit-reversal
  const reordered: ComplexNumber[] = new Array(N);
  for (let n = 0; n < N; n++) {
    reordered[bitReverse(n, bits)] = Complex.copy(x[n]);
  }

  const stages: ComplexNumber[][] = [];
  const butterflies: ButterflyData[][] = [];
  
  let currentData = [...reordered];
  stages.push([...currentData]);

  for (let s = 1; s <= bits; s++) {
    const stageButterflies: ButterflyData[] = [];
    const m = Math.pow(2, s);
    const mHalf = m / 2;
    const nextData = [...currentData];

    for (let k = 0; k < N; k += m) {
      for (let j = 0; j < mHalf; j++) {
        const twiddle = Complex.twiddle(j, m);
        const idxA = k + j;
        const idxB = k + j + mHalf;
        
        const a = currentData[idxA];
        const b = currentData[idxB];
        
        const twiddleB = Complex.mul(twiddle, b);
        
        nextData[idxA] = Complex.add(a, twiddleB);
        nextData[idxB] = Complex.sub(a, twiddleB);
        
        stageButterflies.push({
          stage: s,
          indexA: idxA,
          indexB: idxB,
          twiddle,
          twiddleK: j,
          twiddleN: m
        });
      }
    }
    currentData = nextData;
    stages.push([...currentData]);
    butterflies.push(stageButterflies);
  }

  return { reordered, stages, butterflies };
};

export const calculateOpCounts = (N: number) => {
  const logN = Math.log2(N);
  return {
    dft: {
      mults: N * N,
      adds: N * (N - 1)
    },
    fft: {
      mults: Math.round((N / 2) * logN),
      adds: Math.round(N * logN)
    }
  };
};

export const benchmarkComputation = (x: ComplexNumber[], fn: (data: ComplexNumber[]) => any, trials: number = 5): number => {
  const times: number[] = [];
  for (let i = 0; i < trials; i++) {
    const start = performance.now();
    fn(x);
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]; // Median
};
