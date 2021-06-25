
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const bguiBaseWidth = 640;
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


// ---------------------------------------------------------------------------
//  Makes interpreting (wide, tall, xpos, ypos) much easier
// ---------------------------------------------------------------------------
export function parsePosition(value: string): ParsedLayoutProperty {

  let digit = value.replace(/[^\d.-]/g, '');

  return {
    f: value.includes('f'),
    c: value.includes('c'),
    d: value.includes('d'),
    r: value.includes('r'),
    s: value.includes('s'),

    absolute: Math.abs( parseInt(digit)),
    negative: value.includes('-'),

    value: digit,
    num: parseInt(digit)
  }

}


// ---------------------------------------------------------------------------
//  Make panel styling for width
// ---------------------------------------------------------------------------
export function parseWide(value: string) {
  let parsed = parsePosition(value);

  if(!parsed.f) {
    return `
      width: ${parsed.num}px;
    `
  }

  return `
    width: ${ bguiBaseWidth - parsed.absolute}px;
  `
}


// ---------------------------------------------------------------------------
//  Make panel styling for height
// ---------------------------------------------------------------------------
export function parseTall(value: string) {
  let parsed = parsePosition(value);

  if(!parsed.f) {
    return `
      height: ${parsed.num}px;
    `
  }

  return `
    top: 50%;
    height: ${ bguiBaseWidth - parsed.absolute}px;
  `
}

// ---------------------------------------------------------------------------
//  Make panel styling for xpos
// ---------------------------------------------------------------------------
export function parseXPos(value: string) {
  let parsed = parsePosition(value);

  if(!parsed.c) {
    return `
      left: ${parsed.num}px;
    `
  }

  return `
    left: calc(50% - ${parsed.absolute}px);
  `
}


// ---------------------------------------------------------------------------
//  Make panel styling for ypos
// ---------------------------------------------------------------------------
export function parseYPos(value: string) {
  let parsed = parsePosition(value);

  if(!parsed.c) {
    return `
      top: ${parsed.num}px;
    `
  }

  return `
    top: calc(50% - ${parsed.absolute}px);
  `
}
