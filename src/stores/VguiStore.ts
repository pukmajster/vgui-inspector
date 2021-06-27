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
export const showAllHidden = writable(false);

export const viewportScales = derived(
  [viewportProportions, enableAdaptingViewport],
  ([$viewportProportions, $enableAdaptingViewport]) => ({
    width: $enableAdaptingViewport ? ($viewportProportions.width / vguiBaseWidth) : 1,
    height: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseHeight) : 1,
  })
)


export type AspectRatio = '4 / 3' | '16 / 9' | '16 / 10' | '2 / 1';
export const aspectRatios: AspectRatio[] = ['4 / 3', '16 / 9', '16 / 10', '2 / 1']
export const aspectRatio = writable<AspectRatio>('4 / 3');