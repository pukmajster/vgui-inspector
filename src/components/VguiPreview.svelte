<script lang="ts">
	import { aspectRatio, enableAdaptingViewport, vguiResource, viewportProportions, viewportScales } from "../stores/VguiStore";
	import { vguiBaseWidth, vguiBaseHeight } from "../utils/VguiPanelHelpers";

	import VguiPanel from "./VguiPanel.svelte";

	let viewportWidth, viewportHeight;

	$: {
		viewportProportions.set({
			width:  $enableAdaptingViewport ? viewportWidth : vguiBaseWidth,
			height: $enableAdaptingViewport ? viewportHeight : vguiBaseHeight
		})
	}
</script>

<div class="container">
	<div class="vguiRoot adaptive  " style={`aspect-ratio: ${$aspectRatio};`}  bind:offsetWidth={viewportWidth} bind:offsetHeight={viewportHeight} >

		<!-- <p class="" >{$viewportScales.width}, {$viewportScales.height} </p> -->
		{#if $vguiResource} 
			{#each $vguiResource.children as child} 
				<VguiPanel panel={child} />
			{/each}
		{/if}
	</div>
</div>

<style lang="scss" >
	.container {
		width: 100%;
		height: 100%;

		padding: 3em;
		display: grid;
		place-items: center;
	}

	.vguiRoot {
		width: 80%;
		background-color: rgb(28, 28, 28);
		position: relative;
	}

	.adaptive {
		resize: horizontal;
  	overflow: auto;
	}

	.viewportSize {
		position: absolute;
		top: -25px;
		left: 2px;
	}
</style>