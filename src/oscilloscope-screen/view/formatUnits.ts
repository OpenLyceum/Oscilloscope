/**
 * formatUnits.ts
 *
 * Small pure formatters that turn SI quantities into short, scope-style labels
 * with engineering-friendly units (mV / V, µs / ms, Hz / kHz). Used by the
 * volts/div and time/div pickers and by the on-screen measurement readout.
 *
 * Every label is a localized `{{value}} unit` pattern from the `units` string
 * block, so a locale can reorder the number and unit or change the spacing, and
 * the number takes the locale's decimal separator. The formatters read the
 * current string values, so any Property derived from them must also depend on
 * {@link UNIT_STRING_PROPERTIES} to re-render on a language switch —
 * `derivedString` in controlHelpers.ts does that.
 *
 * All rounding goes through `toFixed` from `scenerystack/dot` rather than the
 * native `Number.prototype.toFixed`, which rounds inconsistently across browsers.
 */

import type { TReadOnlyProperty } from "scenerystack/axon";
import { toFixed } from "scenerystack/dot";
import { StringUtils } from "scenerystack/phetcommon";
import { StringManager } from "../../i18n/StringManager.js";

const units = StringManager.getInstance().getUnits();

/** Every string the formatters read; list these as dependencies of a derived label. */
export const UNIT_STRING_PROPERTIES: readonly TReadOnlyProperty<string>[] = [
  units.decimalSeparatorStringProperty,
  units.voltsPerDivPatternStringProperty,
  units.millivoltsPerDivPatternStringProperty,
  units.millisecondsPerDivPatternStringProperty,
  units.microsecondsPerDivPatternStringProperty,
  units.hertzPatternStringProperty,
  units.kilohertzPatternStringProperty,
  units.millisecondsPatternStringProperty,
  units.microsecondsPatternStringProperty,
  units.nanosecondsPatternStringProperty,
  units.voltsPatternStringProperty,
  units.percentPatternStringProperty,
  units.degreesPatternStringProperty,
  units.divisionsPatternStringProperty,
];

/**
 * Fills a `{{value}}` unit pattern with an already-rounded decimal string (which uses
 * "."), swapping in the locale's decimal separator. e.g. ("{{value}} V", "-1.50", ",")
 * → "-1,50 V".
 */
export function fillUnitPattern(pattern: string, decimal: string, decimalSeparator: string): string {
  return StringUtils.fillIn(pattern, { value: decimal.replace(".", decimalSeparator) });
}

/** Fills a unit pattern in the current locale. */
function fill(pattern: TReadOnlyProperty<string>, decimal: string): string {
  return fillUnitPattern(pattern.value, decimal, units.decimalSeparatorStringProperty.value);
}

/** Formats a number with at most `dp` decimals, dropping trailing zeros. */
function trim(value: number, dp = 3): string {
  return String(Number(toFixed(value, dp)));
}

/** e.g. 0.05 → "50 mV/div", 0.5 → "500 mV/div", 2 → "2 V/div". */
export function formatVoltsPerDiv(voltsPerDiv: number): string {
  return voltsPerDiv >= 1
    ? fill(units.voltsPerDivPatternStringProperty, trim(voltsPerDiv))
    : fill(units.millivoltsPerDivPatternStringProperty, trim(voltsPerDiv * 1000));
}

/** e.g. 0.0001 → "100 µs/div", 0.001 → "1 ms/div", 0.02 → "20 ms/div". */
export function formatTimePerDiv(timePerDiv: number): string {
  return timePerDiv >= 1e-3
    ? fill(units.millisecondsPerDivPatternStringProperty, trim(timePerDiv * 1e3))
    : fill(units.microsecondsPerDivPatternStringProperty, trim(timePerDiv * 1e6));
}

/** e.g. 440 → "440 Hz", 1500 → "1.5 kHz". */
export function formatFrequency(hz: number): string {
  return hz >= 1000
    ? fill(units.kilohertzPatternStringProperty, trim(hz / 1000, 2))
    : fill(units.hertzPatternStringProperty, trim(hz, 0));
}

/** e.g. 0.00227 → "2.27 ms", 0.0005 → "500 µs". */
export function formatPeriod(seconds: number): string {
  if (seconds >= 1e-3) {
    return fill(units.millisecondsPatternStringProperty, trim(seconds * 1e3, 2));
  }
  if (seconds >= 1e-6) {
    return fill(units.microsecondsPatternStringProperty, trim(seconds * 1e6, 1));
  }
  return fill(units.nanosecondsPatternStringProperty, trim(seconds * 1e9, 0));
}

/** e.g. 2 → "2.00 V". */
export function formatVoltage(volts: number): string {
  return fill(units.voltsPatternStringProperty, toFixed(volts, 2));
}

/** e.g. 0.5 → "50%". */
export function formatPercent(fraction: number): string {
  return fill(units.percentPatternStringProperty, String(Math.round(fraction * 100)));
}

/** e.g. 90 → "90°". */
export function formatDegrees(degrees: number): string {
  return fill(units.degreesPatternStringProperty, String(Math.round(degrees)));
}

/** Screen-position readout in graticule divisions, e.g. -1.5 → "-1.50 div". */
export function formatDivisions(divisions: number): string {
  return fill(units.divisionsPatternStringProperty, toFixed(divisions, 2));
}

/**
 * Trigger holdoff readout: the localized `offLabel` at zero, otherwise a time (µs / ms).
 * Callers must pass a locale string (e.g. `trigger.holdoffOff`) — never hardcode English.
 */
export function formatHoldoff(seconds: number, offLabel: string): string {
  return seconds <= 0 ? offLabel : formatPeriod(seconds);
}
