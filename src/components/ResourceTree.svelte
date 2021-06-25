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
  import { vguiResource } from "../stores/VguiStore";
  import ResourceTreePanel from "./ResourceTreePanel.svelte";
</script>

<SideNav style="background-color: #FFFFFF0A;" isOpen={true}>
  <SideNavItems>
    {#if $vguiResource != null} 
      <ResourceTreePanel panel={$vguiResource} />
    {/if}
  </SideNavItems>
</SideNav>

<style lang="scss" >

</style>