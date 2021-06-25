<script lang="ts">
	import { Content } from "carbon-components-svelte";
	import Header from "./components/Header.svelte";
	import ResourceTree from "./components/ResourceTree.svelte";
	import VguiPanelProperties from "./components/VguiPanelProperties.svelte";

</script>

<ResourceTree />
<Header />
<Content style="background-color: transparent; height: 100%; padding: 0; margin-top: 3em;"  >
	<VguiPanelProperties />
</Content>


<style lang="scss" global >

</style>