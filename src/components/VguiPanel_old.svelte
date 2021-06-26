<script lang="ts">
  import { children } from "svelte/internal";
  import { currentEditingVguiPanel, viewportProportions, viewportScales } from "../stores/VguiStore";
import type { ParsedLayoutProperty, ViewportDimensions } from "../utils/VguiPanelHelpers";
  import type { VguiPanel } from "../utils/VguiTypes";  
import VguiPanelProperties from "./VguiPanelProperties.svelte";

  export let panel: VguiPanel;

  function makeStyles(panelProperties, scales, proportions) {
    let { wide = '0', tall = '0', xpos = '0', ypos = '0' } = panelProperties;

    return `
      position: absolute;
      ${parseWide(wide)}
      ${parseTall(tall)}
      ${parseXPos(xpos)}
      ${parseYPos(ypos)}
    `
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
  function parseWide(value: string) {
    let parsed = parsePosition(value);

    if(parsed.f) return `width: ${ $viewportProportions.width - (parsed.absolute  * $viewportScales.width)}px;`
    return `width: ${parsed.num * $viewportScales.width}px;`
  }


  // ---------------------------------------------------------------------------
  //  Make panel styling for height
  // ---------------------------------------------------------------------------
  function parseTall(value: string) {
    let parsed = parsePosition(value);

    if(parsed.f) return `height: ${ $viewportProportions.height - (parsed.absolute * $viewportScales.height)}px;`
    return `height: ${parsed.num * $viewportScales.height}px;`
  }

  // ---------------------------------------------------------------------------
  //  Make panel styling for xpos
  // ---------------------------------------------------------------------------
  function parseXPos(value: string) {
    let parsed = parsePosition(value);

    if(parsed.c) return `left: calc(50% - ${parsed.absolute * $viewportScales.width}px);`
    if(parsed.r) return `right: ${parsed.absolute * $viewportScales.width}px;`
    return `left: ${parsed.num * $viewportScales.width}px;`
  }


  // ---------------------------------------------------------------------------
  //  Make panel styling for ypos
  // ---------------------------------------------------------------------------
  function parseYPos(value: string) {
    let parsed = parsePosition(value);

    if(parsed.c) return `top: calc(50% - ${parsed.absolute * $viewportScales.height }px);`
    if(parsed.r) return `bottom: ${parsed.absolute* $viewportScales.height}px;`
    return `top: ${parsed.num * $viewportScales.height}px;`
  }

  $: panelStyle = makeStyles(panel.properties, $viewportScales, $viewportProportions);
  $: highlight = $currentEditingVguiPanel?.name == panel?.name;

  function setCurrentEditingVguiPanel() {
    currentEditingVguiPanel.set(panel);
  }

  $: hasLabel = panel?.properties?.labelText && panel?.properties?.labelText !== '""'
</script>

{#if panel.properties.visible }
  <div class="panel" class:highlight  style={panelStyle}  on:click={() => setCurrentEditingVguiPanel()}>
    <div class="name">{ hasLabel ? panel?.properties?.labelText : panel.properties.fieldName }</div>

    {#each panel.children as child} 
      <svelte:self panel={child} />
    {/each}
  </div>
{/if}

<style lang="scss" >
  .panel {
    background-color: rgba(208, 208, 208, 0.076);
    border-radius: 0px;

    &.highlight {
      background-color: rgba(215, 13, 255, 0.172);
    }

    &:hover {
      background-color: rgba(215, 13, 255, 0.295);
    }
  }

  .name {
    position: absolute;
    left: 2px;
  }
</style>