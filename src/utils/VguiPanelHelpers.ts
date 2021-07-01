// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// VGUI by default scales all size and position values to these dimensions,
// thus a width of 640 pixels effectively represents the entire screen, when
// "proportionality" is enabled, which is by default in VGUI.
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
// %: width/height of parent in percentage (Used in Titanfall/Apex legends version of the sauce engine)
// ... and some others I haven't bothered implementing such as P, O and S
export type ParsedLayoutProperty = {
  f: boolean;
  c: boolean;
  d: boolean;
  r: boolean;
  s: boolean;
  percent: boolean;

  negative: boolean;
  absolute: number;
  value: string;
  num: number;
}

export type ViewportDimensions = {
  width: number,
  height: number
}

// When parsing these values, '0's and '1's will be parsed as false and true, respectively 
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
