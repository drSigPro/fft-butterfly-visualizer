
import { SignalPreset, SignalConfig, ComplexNumber } from '../types';
import { Complex } from './math';

export const generateSignal = (config: SignalConfig): ComplexNumber[] => {
  const { N, preset, f1, a1, p1, f2, a2, p2 } = config;
  const signal: ComplexNumber[] = new Array(N);

  for (let n = 0; n < N; n++) {
    let val = 0;
    const t = n / N;

    switch (preset) {
      case SignalPreset.SINGLE_TONE:
        val = a1 * Math.sin(2 * Math.PI * f1 * t + p1);
        break;
      case SignalPreset.TWO_TONES:
        val = a1 * Math.sin(2 * Math.PI * f1 * t + p1) + 
              a2 * Math.sin(2 * Math.PI * f2 * t + p2);
        break;
      case SignalPreset.IMPULSE:
        val = n === 0 ? 1 : 0;
        break;
      case SignalPreset.STEP:
        val = n >= N / 2 ? 1 : 0;
        break;
      case SignalPreset.RANDOM_NOISE:
        val = (Math.random() * 2 - 1) * a1;
        break;
      case SignalPreset.CHIRP:
        // Frequency sweeps from 0 to f1
        val = a1 * Math.sin(2 * Math.PI * (f1 / 2) * t * t);
        break;
    }
    signal[n] = Complex.from(val, 0);
  }
  return signal;
};
