
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

  let digit = typeof value != 'undefined' ? value.replace(/[^\d.-]/g, '') : '0' ;

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
    height: ${ vguiBaseHeight - parsed.absolute}px;
  `
}

// ---------------------------------------------------------------------------
//  Make panel styling for xpos
// ---------------------------------------------------------------------------
export function parseXPos(value: string) {
  let parsed = parsePosition(value);

  if(parsed.c) return `left: calc(50% - ${parsed.absolute}px);`
  // if(parsed.r) return `left: calc(100% - ${parsed.absolute}px);`
  if(parsed.r) return `right: ${parsed.absolute}px;`
  return `left: ${parsed.num}px;`
}


// ---------------------------------------------------------------------------
//  Make panel styling for ypos
// ---------------------------------------------------------------------------
export function parseYPos(value: string) {
  let parsed = parsePosition(value);

  if(parsed.c) return `top: calc(50% - ${parsed.absolute}px);`
  // if(parsed.r) return `top: calc(100% - ${parsed.absolute}px);`

  if(parsed.r) return `bottom: ${parsed.absolute}px;`

  return `top: ${parsed.num}px;`
}
