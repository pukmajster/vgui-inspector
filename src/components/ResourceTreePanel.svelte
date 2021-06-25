<script lang="ts">
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SideNavDivider,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
  import { children } from "svelte/internal";
  import type { VguiPanel } from "../utils/VguiTypes";

  export let panel: VguiPanel;
</script>

{#if panel.children.length == 0} 
  <SideNavLink text={panel.name} />
{/if}

{#if panel.children.length > 0} 
  <SideNavMenuItem  text={panel.name} />
  <SideNavMenu text={panel.name + ' children'}>
    <div style="background-color: #0000001F"  >
      {#each panel.children as child} 
        <svelte:self panel={child} />
      {/each}
    </div>
  </SideNavMenu>
{/if}




    <!-- <SideNavLink text="Link 1" />
    <SideNavLink text="Link 2" />
    <SideNavLink text="Link 3" />
    <SideNavMenu text="Menu">
      <SideNavMenuItem href="/" text="Link 1" />
      <SideNavMenuItem href="/" text="Link 2" />
      <SideNavMenuItem href="/" text="Link 3" />
    </SideNavMenu>
    <SideNavDivider />
    <SideNavLink text="Link 4" /> -->


<style lang="scss" >

</style>