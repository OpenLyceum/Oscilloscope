/**
 * Unit labels are localized `{{value}}` patterns: the number takes the locale's
 * decimal separator and the pattern decides spacing and order. The test harness
 * registers only English, so the other locales are checked through the pure
 * `fillUnitPattern` and their string files rather than a runtime locale switch.
 */

import { describe, expect, it } from "vitest";
import stringsEn from "../src/i18n/strings_en.json";
import stringsEs from "../src/i18n/strings_es.json";
import stringsFr from "../src/i18n/strings_fr.json";
import {
  fillUnitPattern,
  formatFrequency,
  formatPercent,
  formatTimePerDiv,
  formatVoltage,
} from "../src/oscilloscope-screen/view/formatUnits.js";

describe("formatUnits", () => {
  it("formats with a decimal point and English spacing in English", () => {
    expect(formatVoltage(2)).toBe("2.00 V");
    expect(formatFrequency(1500)).toBe("1.5 kHz");
    expect(formatTimePerDiv(0.0001)).toBe("100 µs/div");
    expect(formatPercent(0.5)).toBe("50%");
  });

  it("swaps in the locale's decimal separator and follows the pattern's order", () => {
    expect(fillUnitPattern(stringsFr.units.voltsPattern, "-1.50", stringsFr.units.decimalSeparator)).toBe("-1,50 V");
    expect(fillUnitPattern(stringsFr.units.percentPattern, "50", stringsFr.units.decimalSeparator)).toBe("50 %");
    // A locale that puts the unit first only has to reorder its pattern.
    expect(fillUnitPattern("V {{value}}", "2.5", ",")).toBe("V 2,5");
  });

  it("gives every locale a {{value}} placeholder in each unit pattern", () => {
    for (const strings of [stringsEn, stringsEs, stringsFr]) {
      for (const [key, pattern] of Object.entries(strings.units)) {
        if (key !== "decimalSeparator") {
          expect(pattern, key).toContain("{{value}}");
        }
      }
    }
    expect(stringsEs.units.decimalSeparator).toBe(",");
    expect(stringsFr.units.decimalSeparator).toBe(",");
  });
});
