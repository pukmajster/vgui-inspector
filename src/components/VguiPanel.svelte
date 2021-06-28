<script lang="ts">
  import { currentEditingVguiPanel, panelLabelOptions, showAllHidden, viewportProportions, viewportScales } from "../stores/VguiStore";
  import type { ParsedLayoutProperty } from "../utils/VguiPanelHelpers";
  import type { VguiPanel } from "../utils/VguiTypes";  

  export let panel: VguiPanel;

  // TODO: Consider proportionalToParent
  function makeStyles(panelProperties, scales, proportions) {
    let { wide = '0', tall = '0', xpos = '0', ypos = '0', RoundedCorners = 0 } = panelProperties;

    return `
      position: absolute;
      border-radius: ${RoundedCorners}px;
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

    if(parsed.f) return `right: calc( 0px + ${ (parsed.absolute * $viewportScales.width) }px);` 
    return `width: ${parsed.num * $viewportScales.width}px;`
  }


  // ---------------------------------------------------------------------------
  //  Make panel styling for height
  // ---------------------------------------------------------------------------
  function parseTall(value: string) {
    let parsed = parsePosition(value);

    if(parsed.f) return `bottom: calc( 0px + ${ (parsed.absolute * $viewportScales.height) }px);` 
    return `height: ${parsed.num * $viewportScales.height}px;`
  }

  // ---------------------------------------------------------------------------
  //  Make panel styling for xpos
  // ---------------------------------------------------------------------------
  function parseXPos(value: string) {
    let parsed = parsePosition(value);

    if(parsed.c) return `left: calc(50% + ${parsed.num * $viewportScales.width}px);`
    if(parsed.r) return `right: ${parsed.absolute * $viewportScales.width}px;`
    return `left: ${parsed.num * $viewportScales.width}px;`
  }

  // ---------------------------------------------------------------------------
  //  Make panel styling for ypos
  // ---------------------------------------------------------------------------
  function parseYPos(value: string) {
    let parsed = parsePosition(value);

    if(parsed.c) return `top: calc(50% + ${parsed.num * $viewportScales.height }px);`
    if(parsed.r) return `bottom: ${parsed.absolute* $viewportScales.height}px;`
    if(parsed.d) return `bottom: ${parsed.absolute* $viewportScales.height}px;`
    return `top: ${parsed.num * $viewportScales.height}px;`
  }

  // Update styling when any of these conditions change
  $: panelStyle = makeStyles(panel.properties, $viewportScales, $viewportProportions);

  // Highlight the panel currently being edited.
  $: highlight = $currentEditingVguiPanel?.name == panel?.name;

  // Clicking a panel will open the properties menu for the panel
  function setCurrentEditingVguiPanel() {
    currentEditingVguiPanel.set(panel);
  }

  // Determine if the panel has a non-empty labelText property to show
  $: hasLabel = panel?.properties?.labelText && panel?.properties?.labelText !== '""'
</script>

{#if panel.properties.visible || $showAllHidden }
  <div class="panel" class:highlight  style={panelStyle}  on:click={() => setCurrentEditingVguiPanel()}>
    {#if panel.children.length == 0 }
      <div class="name">{ 
        hasLabel || /button|label/.test(panel.properties.ControlName.toLowerCase())
        ? 
          (
            $panelLabelOptions.labels
            ?
              (hasLabel ? panel?.properties?.labelText : panel?.properties?.fieldName)
            : '')
        :
          ($panelLabelOptions.panelName ? panel?.properties?.fieldName : '')
      }</div>
    {/if}

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