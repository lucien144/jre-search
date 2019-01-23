<template>
	<div
		class="video"
		id="video"
	>
		<VCard>
			<VToolbar color="white" flat>
				<VBtn
					icon
					light
					to="/"
				>
					<VIcon color="grey darken-2">fas fa-arrow-left</VIcon>
				</VBtn>
				<VToolbarTitle>{{ $store.state.video.title.original }}</VToolbarTitle>
			</VToolbar>
			<VContainer fluid grid-list-xl>
				<VLayout>
					<VFlex xs12 md8>
						<iframe
							:src="`https://www.youtube.com/embed/${$store.state.video.id}?autoplay=1`"
							width="100%"
							type="text/html"
							frameborder="0"
						/>
					</VFlex>
					<VFlex xs12 md4>
						<p>{{ $store.state.video.description }}</p>
						<div>
							<v-chip
								v-for="(keyword, index) in $store.state.video.keywords"
								:key="index">{{ keyword }}</v-chip>
							<v-chip
								v-for="(hosts, index) in $store.state.video.hosts"
								:key="index">{{ hosts }}</v-chip>
						</div>
					</VFlex>
				</VLayout>
			</VContainer>
		</VCard>
	</div>
</template>

<script>
export default {
	async fetch({ app, store, params }) {
		console.log(`${store.getters.API}/videos/${params.id}`);
		const { data } = await app.$axios.$get(`${store.getters.API}/videos/${params.id}`);
		store.commit('VIDEO_SET', data);
	}
}
</script>

