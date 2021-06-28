// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const vguiBaseWidth = 640;
export const vguiBaseHeight = 480;


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Layout properties can contain the following single character flags:
// f: fill
// c: center
// d: down
// r: right
// s: scale
// ... and some other I haven't bothered implementing
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

export const booleanVguiPanelProperties = [
  'visible',
  'enabled',
  'proportionalToParent',
  'pin_to_sibling_corner',
  'pin_corner_to_sibling'
]

export type Conditionals = {
  [key: string]: boolean
}
