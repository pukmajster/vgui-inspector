<script lang="ts">
  import {
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
  } from "carbon-components-svelte";

  import { currentEditingVguiPanel } from "../stores/VguiStore";
  import type { VguiPanel } from "../utils/VguiTypes";

  export let panel: VguiPanel;
  export let root: boolean = false;

  function setCurrentEditingVguiPanel() {
    currentEditingVguiPanel.set(panel);
  }
</script>

{#if panel.children.length == 0} 
  <SideNavLink text={panel.name} on:click={() => setCurrentEditingVguiPanel()} />
{/if}

{#if panel.children.length > 0} 
  {#if !root}
    <SideNavMenuItem  text={panel.name}  on:click={() => setCurrentEditingVguiPanel()} />
    <SideNavMenu text={panel.name + ' children'}>
      <div style="background-color: #0000001F"  >
        {#each panel.children as child} 
          <svelte:self panel={child} />
        {/each}
      </div>
    </SideNavMenu>
  {:else} 
    <div style="background-color: #0000001F"  >
      {#each panel.children as child} 
        <svelte:self panel={child} />
      {/each}
    </div>
  {/if}
{/if}

<style lang="scss" >

</style>