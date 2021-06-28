<script lang="ts">
	import { Content } from "carbon-components-svelte";
	import Header from "./components/Header.svelte";
	import ResourceTree from "./components/ResourceTree.svelte";
	import VguiPanelProperties from "./components/VguiPanelProperties.svelte";
	import VguiPreview from "./components/VguiPreview.svelte";

	const contentStyle = `
		background-color: transparent;
		height: 100%;
		padding: 0;

		display: grid;
		grid-template-columns: 270px 1fr;
	`
</script>

<ResourceTree />
<Header />
<Content style={contentStyle}  >
	<VguiPanelProperties />
	<VguiPreview />
</Content>

<style lang="scss" global >

</style>