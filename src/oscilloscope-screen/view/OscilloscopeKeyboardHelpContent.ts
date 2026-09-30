/**
 * OscilloscopeKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * Sliders cover the front-panel knobs. Move Draggable Items covers the
 * trigger-level line on the CRT (arrow keys, shift for a finer step).
 */

import {
  BasicActionsKeyboardHelpSection,
  MoveDraggableItemsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class OscilloscopeKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    super(
      [new SliderControlsKeyboardHelpSection(), new MoveDraggableItemsKeyboardHelpSection()],
      [new BasicActionsKeyboardHelpSection()],
    );
  }
}
