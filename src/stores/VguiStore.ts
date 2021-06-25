import { writable } from "svelte/store";
import type { VguiPanel } from "../utils/VguiTypes";

export const vguiResource = writable<VguiPanel | null>(null);
export const currentEditingVguiPanel = writable<VguiPanel | null>(null);