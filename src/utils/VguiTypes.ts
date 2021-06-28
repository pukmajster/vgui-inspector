
export type VguiPanel = {
  name?: string;
  properties?: VguiPanelProperties;
  children?: VguiPanel[]
}

export type VguiPanelProperties = {

  ControlName?: string;
  fieldName?: string;
 
  wide?: string;
  tall?: string;
  xpos?: string;
  ypos?: string;
  autoResize?: string;
  pinCorner?: string;
  proportionalToParent?: boolean;

  visible?: boolean;
  enabled?: boolean;

  pin_to_sibling?: string;
  pin_to_sibling_corner?: boolean;
  pin_corner_to_sibling?: boolean;

  RoundedCorners?: number;

  // Label and button specific properties
  labelText?: string;
} 

export type VguiTextAlignment = 'north-west' | 'north' | 'north-east' | 'west' | 'center' | 'east' | 'south-west' | 'south' | 'south-east';