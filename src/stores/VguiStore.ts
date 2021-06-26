import { derived, writable } from "svelte/store";
import { vguiBaseWidth } from "../utils/VguiPanelHelpers";
import type { VguiPanel } from "../utils/VguiTypes";

export const vguiResource = writable<VguiPanel | null>(null);
export const currentEditingVguiPanel = writable<VguiPanel | null>(null);
export const viewportProportions = writable({
  width: 1,
  height: 1
})

export const enableAdaptingViewport = writable(false);
export const showAllHidden = writable(false);

export const viewportScales = derived(
  [viewportProportions, enableAdaptingViewport],
  ([$viewportProportions, $enableAdaptingViewport]) => ({
    width: $enableAdaptingViewport ? ($viewportProportions.width / vguiBaseWidth) : 1,
    height: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseWidth) : 1,
  })
)
