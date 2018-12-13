<template>
	<VDialog
		v-if="$store.state.video"
		v-model="$store.state.video"
		@input="v => v || $store.commit('video', null)"
	>
		<VCard>
			<VProgressCircular
				:size="50"
				color="primary"
				indeterminate
				class="loader"
			/>
			<iframe
				:src="`https://www.youtube.com/embed/${$store.state.video.id}?autoplay=1`"
				type="text/html"
				frameborder="0"
			/>
		</VCard>
	</VDialog>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.loader {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 1;
	transform: translate(-50%, -50%);
}
iframe {
	position: relative;
	z-index: 2;
	width: 100%;
	height: 80vh;
}
</style>
