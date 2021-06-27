<script lang="ts">

  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Modal,
    TextArea, TextInput, Toggle, Dropdown, AspectRatio, SideNavDivider 
  } from "carbon-components-svelte";
  import { text } from "svelte/internal";
  import { aspectRatio, aspectRatios, enableAdaptingViewport, panelLabelOptions, showAllHidden, vguiResource } from "../stores/VguiStore";
  import { kvExample } from "../utils/KvTest";
  import { tokenizeResFileAndParseToVgui } from "../utils/VguiParser";

  let showLoad = false;
  let loadValue = kvExample;
  function submitLoad() {
    showLoad = false;
    tokenizeResFileAndParseToVgui(loadValue);
  }

  function toggleAdaptiveViewport() {
    enableAdaptingViewport.update(_old => !_old);
  }

  function toggleShowAllHidden() {
    showAllHidden.update(_old => !_old);
  }

  function updateAspectRatio(value) {
    aspectRatio.set(value);
  }

  function TogglePanelLabelOption(option: string) {
    panelLabelOptions.update(_old => {
      let copy = { ..._old };
      copy[option] = !copy[option];
      return copy;
    })
  }
  
</script>

<Header company="VGUI Inspector" platformName={$vguiResource?.name}  isSideNavOpen={true}>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavMenu text="File">
      <HeaderNavItem text="Load .res" on:click={() => (showLoad = true)} />
    </HeaderNavMenu>
    
    <HeaderNavMenu text="View">
      <HeaderNavItem text={$showAllHidden ? 'Hide all hidden' : 'Show all hidden'} on:click={() => toggleShowAllHidden()} />

      <SideNavDivider />

      <HeaderNavItem text={$panelLabelOptions.panelName ? 'Hide Panel Names' : 'Show Panel Names'} on:click={() => TogglePanelLabelOption('panelName')} />
      <HeaderNavItem text={$panelLabelOptions.labels ? 'Hide Labels' : 'Show Labels'} on:click={() => TogglePanelLabelOption('labels')} />
    </HeaderNavMenu>

    <HeaderNavMenu text={`Aspect Ratio: ${$aspectRatio}`}>
      {#each aspectRatios as _ar} 
        <HeaderNavItem text={_ar} on:click={() => updateAspectRatio(_ar)} />
      {/each}
    </HeaderNavMenu>

    

    <!-- <Toggle bind:toggled={$enableAdaptingViewport} size="sm" labelB="Adaptive Viewport Enabled" labelA="Adaptive Viewport Disabled"  /> -->
  
  </HeaderNav>
</Header>

<Modal
  bind:open={showLoad}
  modalHeading="Load VGUI Resource"
  primaryButtonText="Load"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (showLoad = false)}
  on:submit={() => submitLoad()}
>
  <TextArea labelText="VGUI Resource" bind:value={loadValue}  />
</Modal>


<style lang="scss" >
  .inlineTools {
    display: flex;
    align-items: center;
  }
</style>