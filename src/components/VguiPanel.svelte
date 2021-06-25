<script lang="ts">
  import { children } from "svelte/internal";
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
</script>

<div class="panel"  style={panelStyle} >

  <div class="name">{panel.properties.fieldName}</div>

  {#each panel.children as child} 
    <svelte:self panel={child} />
  {/each}
</div>

<style lang="scss" >
  .panel {
    background-color: rgba(255, 13, 13, 0.042);
  }

  .name {
    position: absolute;
    top: 3px;
    left: 5px;
  }
</style>