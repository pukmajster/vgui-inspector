<script lang="ts">
  import {
    FluidForm,
    TextInput,
    PasswordInput,
    SideNavDivider,
    Toggle,
    Dropdown
  } from "carbon-components-svelte";
  import { currentEditingVguiPanel, vguiResource } from "../stores/VguiStore";
import { vguiAutoResizeOptions, vguiPinCorners, vguiPinCorners2 } from "../utils/VguiChoices";

  // This hack makes the entire structure update correctly
  $: {
    $currentEditingVguiPanel;
    vguiResource.update(old => old);
  }

</script>

<div class="root" >
  <div class="controls">
    {#if $currentEditingVguiPanel != null}

      {#each Object.keys($currentEditingVguiPanel.properties) as property} 
        <!-- <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties[property]} labelText={property} placeholder=""  /> -->
      {/each}

      <TextInput size="sm" bind:value={$currentEditingVguiPanel.name} labelText="Panel Name" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.ControlName} labelText="ControlName" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.fieldName} labelText="fieldName" placeholder=""  />

      <Toggle size="sm" bind:toggled={$currentEditingVguiPanel.properties.visible} labelText="Visible" placeholder=""  />
      <Toggle size="sm"bind:toggled={$currentEditingVguiPanel.properties.enabled} labelText="Enabled" placeholder=""  />

      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.wide} labelText="Wide" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.tall} labelText="Tall" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.xpos} labelText="X Position" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.ypos} labelText="Y Position" placeholder=""  />
<!-- 
      <Toggle size="sm" bind:toggled={$currentEditingVguiPanel.properties.proportionalToParent} labelText="Proportional To Parent" placeholder=""  />
      <Dropdown
        titleText="Pin Corner"
        selectedIndex={0}
        items={vguiPinCorners2.map(_pinCorner => ({
          id: _pinCorner,
          text: _pinCorner
        }))}
      />

      <Dropdown
        titleText="Auto Resize"
        selectedIndex={0}
        items={vguiAutoResizeOptions.map(_autoResizeOption => ({
          id: _autoResizeOption,
          text: _autoResizeOption
        }))}
      />

      <Toggle size="sm" bind:toggled={$currentEditingVguiPanel.properties.pin_corner_to_sibling} labelText="Pin Corner To Sibling" placeholder=""  />
      <Toggle size="sm" bind:toggled={$currentEditingVguiPanel.properties.pin_to_sibling_corner} labelText="Pin To Sibling Corner " placeholder=""  /> -->

      <!-- <div style="height: 300px"></div> -->
    {/if}
  </div>
</div>

<style lang="scss"  >
  .root {
    height: 100%;

    padding-top: 3em;
    padding-bottom: 1em;

    background-color: rgba(0, 0, 0, 0.205);

    overflow: hidden;
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;

    padding: 1em 1em;
    padding-bottom: 2em;
    max-height: 100%;

    overflow: auto;
  }
</style>