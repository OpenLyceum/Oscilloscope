/**
 * OscilloscopePanel.ts
 *
 * A pre-themed Panel that automatically uses OscilloscopeColors for background and
 * border. Use this for all control panels and info boxes in the sim so that
 * default / projector mode switching is handled automatically.
 *
 * ── Basic usage ───────────────────────────────────────────────────────────────
 *
 *   import { OscilloscopePanel } from "../../common/OscilloscopePanel.js";
 *   import { VBox, Text } from "scenerystack/scenery";
 *
 *   const content = new VBox({
 *     children: [ new Text("label"), slider ],
 *     spacing: 8,
 *   });
 *   const panel = new OscilloscopePanel(content);
 *
 * ── Overriding defaults ───────────────────────────────────────────────────────
 *
 *   // Wider margins, sharper corners, custom stroke
 *   const panel = new OscilloscopePanel(content, { xMargin: 20, cornerRadius: 0 });
 *
 *   // Transparent background (decorative border only)
 *   const panel = new OscilloscopePanel(content, { fill: "transparent" });
 */

import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { Node } from "scenerystack/scenery";
import { Panel, type PanelOptions } from "scenerystack/sun";
import OscilloscopeColors from "../OscilloscopeColors.js";
import { PANEL_CORNER_RADIUS } from "../OscilloscopeConstants.js";

export type OscilloscopePanelOptions = PanelOptions;

export class OscilloscopePanel extends Panel {
  public constructor(content: Node, providedOptions?: OscilloscopePanelOptions) {
    const options = optionize<OscilloscopePanelOptions, EmptySelfOptions, PanelOptions>()(
      {
        fill: OscilloscopeColors.panelBackgroundColorProperty,
        stroke: OscilloscopeColors.panelBorderColorProperty,
        cornerRadius: PANEL_CORNER_RADIUS,
        xMargin: 12,
        yMargin: 10,
      },
      providedOptions,
    );
    super(content, options);
  }
}
