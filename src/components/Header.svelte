<script lang="ts">

  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Modal,
    TextArea, SideNavDivider, Checkbox 
  } from "carbon-components-svelte";
  import { aspectRatio, aspectRatios, enableAdaptingViewport, panelLabelOptions, showAllHidden, vguiResource } from "../stores/VguiStore";
  import { kvExample } from "../utils/KvTest";
  import type { Conditionals } from "../utils/VguiPanelHelpers";  
  import { tokenizeResFileAndParseToVgui } from "../utils/VguiParser";

  let showLoad = false;
  let loadValue = kvExample;
  function submitLoad() {
    showLoad = false;
    tokenizeResFileAndParseToVgui(loadValue, conditionals);
  }

  // TODO: Remove all traces of adaptive viewport?
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

  // Gather a list of all conditionals within the RES file
  // TODO: This implementation is poo. Improve it?
  $: conditionals = <Conditionals>(() => {
    let allMatches = loadValue.match(/\[(.*?)\]/g) ?? [];

    let temp = {};

    for(let _conditional of allMatches) {
      if(!temp[_conditional]) {
        temp[_conditional] = true;
      }
    }

    return temp;
  })()


  $: console.log(conditionals)
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
  size="lg"
  bind:open={showLoad}
  modalHeading="Load VGUI Resource"
  primaryButtonText="Load"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (showLoad = false)}
  on:submit={() => submitLoad()}
>
  <div class="import-res-root">
    <TextArea style="min-height: 400px" labelText="VGUI Resource" bind:value={loadValue}  />

    <div class="conditionals">
      <p>Conditonals</p>
      {#each (Object.keys(conditionals)) as _conditional, i}
        <Checkbox labelText={_conditional} bind:checked={conditionals[_conditional]} />
      {/each}
    </div>
  </div>
</Modal>


<style lang="scss" >
  .import-res-root {
    display: grid;
    grid-template-columns: 1fr 200px;

    gap: 10px;
    min-height: 400px;

    & > div, & textarea {
      min-height: 400px !important;
    }
  }
</style>