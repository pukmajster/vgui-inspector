<script lang="ts">
  import { children } from "svelte/internal";
  import { currentEditingVguiPanel } from "../stores/VguiStore";
  import { parsePosition, parseTall, parseWide, parseXPos, parseYPos } from "../utils/VguiPanelHelpers";
  import type { VguiPanel } from "../utils/VguiTypes";  

  export let panel: VguiPanel;

  function makeStyles(panelProperties) {
    let { wide = '0', tall = '0', xpos = '0', ypos = '0' } = panelProperties;

    return `
      position: absolute;
      ${parseWide(wide)}
      ${parseTall(tall)}

      ${parseXPos(xpos)}
      ${parseYPos(ypos)}
    `
  }

  function parseXPosition(xpos: string) {
    if(!xpos.includes('-') || !xpos.includes('c') || !xpos.includes('+')) return 
  }

  $: panelStyle = makeStyles(panel.properties);
  $: highlight = $currentEditingVguiPanel?.name == panel?.name;

  function setCurrentEditingVguiPanel() {
    currentEditingVguiPanel.set(panel);
  }
</script>

<div class="panel" class:highlight  style={panelStyle}  on:click={() => setCurrentEditingVguiPanel()}>

  <div class="name">{ panel.properties.labelText ?? panel.properties.fieldName }</div>

  {#each panel.children as child} 
    <svelte:self panel={child} />
  {/each}
</div>

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