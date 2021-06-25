
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

  tabPosition?: number;

  // Label and button specific properties
  textAlignment?: string;
  font?: string;
  dulltext?: string;
  brighttext?: string;
} 

export type VguiTextAlignment = 'north-west' | 'south-west';
