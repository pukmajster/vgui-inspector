<script lang="ts">

  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Modal,
    TextArea, TextInput, Toggle 
  } from "carbon-components-svelte";
  import { enableAdaptingViewport, vguiResource } from "../stores/VguiStore";
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
  
</script>

<Header company="VGUI Inspector" platformName={$vguiResource?.name}  isSideNavOpen={true}>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavMenu text="File">
      <HeaderNavItem text="Load .res" on:click={() => (showLoad = true)} />
      <HeaderNavItem text="Save as .res" />
    </HeaderNavMenu>

    <Toggle bind:toggled={$enableAdaptingViewport} size="sm" labelB="Adaptive Viewport Enabled" labelA="Adaptive Viewport Disabled"  />
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

</style>