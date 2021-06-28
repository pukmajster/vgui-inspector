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

<SideNav style="background-color: #0d0d0d;" isOpen={true}>
  <SideNavItems>
    <div class="root">

      {#if $vguiResource != null} 
        <ResourceTreePanel panel={$vguiResource} root={true}  />
      {/if}

    </div>

  </SideNavItems>
</SideNav>

<style lang="scss" >
  .root {
    color: white;
  }
</style>