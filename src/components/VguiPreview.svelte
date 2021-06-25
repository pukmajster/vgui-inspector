<script lang="ts">
import { vguiResource } from "../stores/VguiStore";

import VguiPanel from "./VguiPanel.svelte";

	
</script>

<div class="container">
	<div class="vguiRoot">
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
		width: 640px;
		height: 480px;

		/* width: 100%; */
		/* aspect-ratio: 16 / 9; */

		background-color: rgb(28, 28, 28);

		position: relative;
	}
</style>