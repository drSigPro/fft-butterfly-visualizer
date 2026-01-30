
export interface ComplexNumber {
  re: number;
  im: number;
}

export enum SignalPreset {
  SINGLE_TONE = 'Single Tone',
  TWO_TONES = 'Two Tones',
  IMPULSE = 'Impulse',
  STEP = 'Step',
  RANDOM_NOISE = 'Random Noise',
  CHIRP = 'Chirp'
}

export interface SignalConfig {
  N: number;
  preset: SignalPreset;
  f1: number;
  a1: number;
  p1: number;
  f2: number;
  a2: number;
  p2: number;
}

export interface ComputationStats {
  dftTime: number;
  fftTime: number;
  dftOps: { mults: number; adds: number };
  fftOps: { mults: number; adds: number };
}

export interface ButterflyData {
  stage: number;
  indexA: number;
  indexB: number;
  twiddle: ComplexNumber;
  twiddleK: number;
  twiddleN: number;
}
