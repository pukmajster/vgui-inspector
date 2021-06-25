<script lang="ts">
  import {
    FluidForm,
    TextInput,
    PasswordInput,
    SideNavDivider
  } from "carbon-components-svelte";
  import { currentEditingVguiPanel, vguiResource } from "../stores/VguiStore";

  $: {
    $currentEditingVguiPanel;
    vguiResource.update(old => old);
  }
</script>

<div class="root" >
  <div class="controls">
    {#if $currentEditingVguiPanel != null}
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.name} labelText="Panel Name" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.ControlName} labelText="ControlName" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.properties.fieldName} labelText="fieldName" placeholder=""  />

      <TextInput size="sm" bind:value={$currentEditingVguiPanel.name} labelText="Panel Name" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.name} labelText="Panel Name" placeholder=""  />
      <TextInput size="sm" bind:value={$currentEditingVguiPanel.name} labelText="Panel Name" placeholder=""  />
    {/if}
    </div>
</div>

<style lang="scss"  >
  .root {
    max-width: 250px;
    height: 100%;


    padding: 1em;
    padding-top: 3em;

    background-color: rgba(0, 0, 0, 0.205);

  }

  .controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
</style>