/**
 * Spectrum.test.ts
 *
 * Unit tests for the FFT used by the oscilloscope's spectrum (FFT) display mode.
 */

import { describe, expect, it } from "vitest";
import {
  computeMagnitudeSpectrum,
  createSpectrumScratch,
  largestPowerOfTwoAtMost,
} from "../src/oscilloscope-screen/model/Spectrum.js";

describe("largestPowerOfTwoAtMost", () => {
  it("returns the largest power of two not exceeding n", () => {
    expect(largestPowerOfTwoAtMost(560)).toBe(512);
    expect(largestPowerOfTwoAtMost(512)).toBe(512);
    expect(largestPowerOfTwoAtMost(5)).toBe(4);
    expect(largestPowerOfTwoAtMost(1)).toBe(1);
  });
});

describe("computeMagnitudeSpectrum", () => {
  it("peaks at the fundamental bin of a pure sine", () => {
    const n = 512;
    const cycles = 8; // 8 complete cycles across the record → energy in bin 8
    const samples = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      samples[i] = Math.sin((2 * Math.PI * cycles * i) / n);
    }
    const mag = computeMagnitudeSpectrum(samples);

    let peakBin = 0;
    let peak = 0;
    for (let k = 0; k < mag.length; k++) {
      if ((mag[k] ?? 0) > peak) {
        peak = mag[k] ?? 0;
        peakBin = k;
      }
    }
    expect(peakBin).toBe(cycles);
    expect(peak).toBeCloseTo(1); // normalized to the peak bin
    for (const magnitude of mag) {
      expect(magnitude).toBeGreaterThanOrEqual(0);
      expect(magnitude).toBeLessThanOrEqual(1);
    }
  });

  it("clears the previous frame when reusing FFT scratch buffers for silence", () => {
    const samples = new Float32Array(256);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.sin((2 * Math.PI * 5 * i) / samples.length);
    }
    const scratch = createSpectrumScratch(samples.length);
    const tone = computeMagnitudeSpectrum(samples, scratch);
    expect(tone).toBe(scratch.magnitudes);
    expect(tone[5]).toBeCloseTo(1);

    samples.fill(0);
    const silence = computeMagnitudeSpectrum(samples, scratch);
    expect(silence).toBe(tone);
    expect(silence).toEqual(new Float32Array(samples.length / 2));
  });
});
