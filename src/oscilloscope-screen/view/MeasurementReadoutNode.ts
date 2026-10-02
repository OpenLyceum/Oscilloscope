/**
 * MeasurementReadoutNode.ts
 *
 * A translucent automatic-measurements readout overlaid on the top-left of the
 * display, echoing a real scope's MEASURE panel: frequency, period, peak and RMS
 * voltages, duty cycle, rise/fall times, mean, and (when CH2 is on) CH1–CH2
 * phase. The view feeds it live numeric Properties; this node formats them.
 *
 * Visibility is bound to the Preferences → Simulation "Show on-screen
 * measurements" toggle.
 */

import type { TReadOnlyProperty } from "scenerystack/axon";
import { GridBox, Rectangle, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { DisposalBag } from "../../common/DisposalBag.js";
import { StringManager } from "../../i18n/StringManager.js";
import OscilloscopeColors from "../../OscilloscopeColors.js";
import {
  READOUT_COLUMN_SPACING,
  READOUT_CORNER_RADIUS,
  READOUT_FONT_SIZE,
  READOUT_INSET,
  READOUT_ROW_SPACING,
  READOUT_X_PADDING,
  READOUT_Y_PADDING,
} from "../../OscilloscopeConstants.js";
import { derivedString } from "./controlHelpers.js";
import { formatDegrees, formatFrequency, formatPercent, formatPeriod, formatVoltage } from "./formatUnits.js";

const READOUT_FONT = new PhetFont(READOUT_FONT_SIZE);

export type MeasurementProperties = {
  /** Signal frequency in Hz; 0 or negative renders as "—". */
  readonly frequencyProperty: TReadOnlyProperty<number>;
  /** Signal period in seconds; 0 or negative renders as "—". */
  readonly periodProperty: TReadOnlyProperty<number>;
  readonly vppProperty: TReadOnlyProperty<number>;
  readonly vrmsProperty: TReadOnlyProperty<number>;
  readonly vmaxProperty: TReadOnlyProperty<number>;
  readonly vminProperty: TReadOnlyProperty<number>;
  readonly dutyCycleProperty: TReadOnlyProperty<number>;
  readonly riseTimeProperty: TReadOnlyProperty<number>;
  readonly fallTimeProperty: TReadOnlyProperty<number>;
  readonly meanProperty: TReadOnlyProperty<number>;
  /** Phase of CH2 relative to CH1 in degrees; negative hides the row. */
  readonly phaseProperty: TReadOnlyProperty<number>;
  readonly showPhaseProperty: TReadOnlyProperty<boolean>;
};

export class MeasurementReadoutNode extends Rectangle {
  private readonly bag: DisposalBag;

  public constructor(measurements: MeasurementProperties, showMeasurementsProperty: TReadOnlyProperty<boolean>) {
    const bag = new DisposalBag();
    const m = StringManager.getInstance().getMeasurements();
    const none = m.noneStringProperty;

    const valueText = (property: TReadOnlyProperty<string>): Text => {
      const text = new Text(property, { font: READOUT_FONT, fill: OscilloscopeColors.displayReadoutColorProperty });
      bag.own(text);
      return text;
    };

    const labelText = (property: TReadOnlyProperty<string>): Text => {
      const text = new Text(property, { font: READOUT_FONT, fill: OscilloscopeColors.displayReadoutColorProperty });
      bag.own(text);
      return text;
    };

    const freqString = derivedString(
      measurements.frequencyProperty,
      (hz) => (hz > 0 ? formatFrequency(hz) : none.value),
      [none],
    );
    const periodString = derivedString(measurements.periodProperty, (s) => (s > 0 ? formatPeriod(s) : none.value), [
      none,
    ]);
    const vppString = derivedString(measurements.vppProperty, formatVoltage);
    const vrmsString = derivedString(measurements.vrmsProperty, formatVoltage);
    const vmaxString = derivedString(measurements.vmaxProperty, formatVoltage);
    const vminString = derivedString(measurements.vminProperty, formatVoltage);
    const dutyString = derivedString(measurements.dutyCycleProperty, (d) => (d > 0 ? formatPercent(d) : none.value), [
      none,
    ]);
    const riseString = derivedString(measurements.riseTimeProperty, (s) => (s > 0 ? formatPeriod(s) : none.value), [
      none,
    ]);
    const fallString = derivedString(measurements.fallTimeProperty, (s) => (s > 0 ? formatPeriod(s) : none.value), [
      none,
    ]);
    const meanString = derivedString(measurements.meanProperty, formatVoltage);
    const phaseString = derivedString(
      measurements.phaseProperty,
      (deg) => (deg >= 0 ? formatDegrees(deg) : none.value),
      [none],
    );

    bag.own(
      freqString,
      periodString,
      vppString,
      vrmsString,
      vmaxString,
      vminString,
      dutyString,
      riseString,
      fallString,
      meanString,
      phaseString,
    );

    const phaseLabel = labelText(m.phaseStringProperty);
    const phaseValue = valueText(phaseString);
    bag.link(measurements.showPhaseProperty, (show) => {
      phaseLabel.visible = show;
      phaseValue.visible = show;
    });

    const grid = new GridBox({
      xSpacing: READOUT_COLUMN_SPACING,
      ySpacing: READOUT_ROW_SPACING,
      xAlign: "left",
      rows: [
        [labelText(m.frequencyStringProperty), valueText(freqString)],
        [labelText(m.periodStringProperty), valueText(periodString)],
        [labelText(m.vppStringProperty), valueText(vppString)],
        [labelText(m.vrmsStringProperty), valueText(vrmsString)],
        [labelText(m.vmaxStringProperty), valueText(vmaxString)],
        [labelText(m.vminStringProperty), valueText(vminString)],
        [labelText(m.dutyCycleStringProperty), valueText(dutyString)],
        [labelText(m.riseTimeStringProperty), valueText(riseString)],
        [labelText(m.fallTimeStringProperty), valueText(fallString)],
        [labelText(m.meanStringProperty), valueText(meanString)],
        [phaseLabel, phaseValue],
      ],
    });

    super(0, 0, grid.width + READOUT_X_PADDING, grid.height + READOUT_Y_PADDING, {
      fill: OscilloscopeColors.readoutBackgroundColorProperty,
      cornerRadius: READOUT_CORNER_RADIUS,
      visibleProperty: showMeasurementsProperty,
    });
    grid.left = READOUT_INSET;
    grid.centerY = this.rectHeight / 2;
    this.addChild(grid);

    this.bag = bag;
    this.bag.own(grid);
  }

  public override dispose(): void {
    this.bag.dispose();
    super.dispose();
  }
}
