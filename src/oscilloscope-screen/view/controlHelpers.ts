/**
 * controlHelpers.ts
 *
 * Small factories shared by the front-panel control panels: they turn value
 * tables into {@link RotarySwitchItem} lists and wrap model Properties in the
 * short, formatted string Properties that the knobs display as live readouts.
 */

import { DerivedProperty, type TReadOnlyProperty } from "scenerystack/axon";
import type { RotarySwitchItem } from "../../common/controls/RotarySwitch.js";
import type { DisposalBag } from "../../common/DisposalBag.js";
import { UNIT_STRING_PROPERTIES } from "./formatUnits.js";

/** Switch positions for a numeric table (volts/div, time/div), formatted to labels. */
export function numberItems(
  values: readonly number[],
  format: (value: number) => string,
  bag: DisposalBag,
): RotarySwitchItem<number>[] {
  return values.map((value) => {
    // Re-formatted on a locale change, so the unit pattern and decimal separator follow it.
    const stringProperty = DerivedProperty.deriveAny([...UNIT_STRING_PROPERTIES], () => format(value));
    bag.own(stringProperty);
    return { value, stringProperty };
  });
}

/** Switch positions for a string-union table, using localized label Properties. */
export function unionItems<T extends string>(
  values: readonly T[],
  labels: Record<T, TReadOnlyProperty<string>>,
): RotarySwitchItem<T>[] {
  return values.map((value) => ({ value, stringProperty: labels[value] }));
}

/**
 * A live, formatted readout string derived from a numeric model Property. The unit
 * strings are dependencies too, so the readout follows a locale change; pass any other
 * string `format` reads (e.g. the "no measurement" dash) as `extraDependencies`.
 */
export function derivedString<T>(
  property: TReadOnlyProperty<T>,
  format: (value: T) => string,
  extraDependencies: readonly TReadOnlyProperty<unknown>[] = [],
): TReadOnlyProperty<string> {
  return DerivedProperty.deriveAny([property, ...extraDependencies, ...UNIT_STRING_PROPERTIES], () =>
    format(property.value),
  );
}
