
import { ComplexNumber } from '../types';

export class Complex {
  static from(re: number, im: number = 0): ComplexNumber {
    return { re, im };
  }

  static add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return { re: a.re + b.re, im: a.im + b.im };
  }

  static sub(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return { re: a.re - b.re, im: a.im - b.im };
  }

  static mul(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return {
      re: a.re * b.re - a.im * b.im,
      im: a.re * b.im + a.im * b.re
    };
  }

  static magnitude(a: ComplexNumber): number {
    return Math.sqrt(a.re * a.re + a.im * a.im);
  }

  static phase(a: ComplexNumber): number {
    return Math.atan2(a.im, a.re);
  }

  static exp(angle: number): ComplexNumber {
    return {
      re: Math.cos(angle),
      im: Math.sin(angle)
    };
  }

  static twiddle(k: number, N: number): ComplexNumber {
    // W_N^k = e^(-j * 2 * pi * k / N)
    const angle = -2 * Math.PI * k / N;
    return this.exp(angle);
  }

  static copy(a: ComplexNumber): ComplexNumber {
    return { ...a };
  }
}
