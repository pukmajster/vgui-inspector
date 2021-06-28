import { derived, writable } from "svelte/store";
import { vguiBaseHeight, vguiBaseWidth } from "../utils/VguiPanelHelpers";
import type { VguiPanel } from "../utils/VguiTypes";

export const vguiResource = writable<VguiPanel | null>(null);
export const currentEditingVguiPanel = writable<VguiPanel | null>(null);
export const viewportProportions = writable({
  width: 1,
  height: 1
})

export const enableAdaptingViewport = writable(true);

// Forces all hidden panels to be drawn regardless of their 'visible' property.
export const showAllHidden = writable(false);

// VGUI scales xpos, ypos, wide, and tall properties based on the window's height, which
// is why viewportScales.width is scaled to fit the height.
export const viewportScales = derived(
  [viewportProportions, enableAdaptingViewport],
  ([$viewportProportions, $enableAdaptingViewport]) => ({
    width: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseHeight) : 1,
    height: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseHeight) : 1,
  })
)

// Lets the user to select an aspect ratio for the viewport
export type AspectRatio = '4 / 3' | '16 / 9' | '16 / 10' | '2 / 1';
export const aspectRatios: AspectRatio[] = ['4 / 3', '16 / 9', '16 / 10', '2 / 1']
export const aspectRatio = writable<AspectRatio>('4 / 3');

export const panelLabelOptions = writable({
  allPanelNames: false,
  panelName: true,
  labels: true,
})