// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const vguiBaseWidth = 640;
export const vguiBaseHeight = 480;


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ParsedLayoutProperty = {
  f: boolean;
  c: boolean;
  d: boolean;
  r: boolean;
  s: boolean;
  negative: boolean;
  absolute: number;
  value: string;
  num: number;
}

export type ViewportDimensions = {
  width: number,
  height: number
}
