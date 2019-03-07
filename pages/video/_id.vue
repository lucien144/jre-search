<template>
	<div
		id="video"
		class="video"
	>
		<VCard>
			<VCardTitle>
				<VBtn
					icon
					light
					to="/"
				>
					<VIcon color="grey darken-2">
						fas fa-arrow-left
					</VIcon>
				</VBtn>
				<VToolbarTitle>{{ $store.state.video.title.original }}</VToolbarTitle>
			</VCardTitle>
			<VCardText>
				<VContainer pt-0 px-3 fluid grid-list-xl>
					<VLayout wrap>
						<VFlex xs12 md8>
							<iframe
								:src="`https://www.youtube.com/embed/${$store.state.video.id}?autoplay=1`"
								width="100%"
								height="100%"
								type="text/html"
								frameborder="0"
							/>
						</VFlex>
						<VFlex xs12 md4>
							<p>{{ $store.state.video.description }}</p>

							<p>
								<VChip
									v-for="(keyword, index) in $store.state.video.keywords"
									:key="index"
								>
									{{ keyword }}
								</VChip>
								<VChip
									v-for="(hosts, index) in $store.state.video.hosts"
									:key="index"
								>
									{{ hosts }}
								</VChip>
							</p>

							<VDivider />
							<p>
								<VChip label color="white">
									<VIcon left>
										fas fa-eye
									</VIcon>{{ $store.state.video.statistics.viewCount | format }}
								</VChip>
								<VChip label color="white">
									<VIcon left>
										fas fa-thumbs-up
									</VIcon>{{ $store.state.video.statistics.likeCount | format }}
								</VChip>
								<VChip label color="white">
									<VIcon left>
										fas fa-thumbs-down
									</VIcon>{{ $store.state.video.statistics.dislikeCount | format }}
								</VChip>
								<VChip label color="white">
									<VIcon left>
										fas fa-comment-alt
									</VIcon>{{ $store.state.video.statistics.commentCount | format }}
								</VChip>
							</p>
						</VFlex>
					</VLayout>
				</VContainer>
			</VCardText>
		</VCard>
	</div>
</template>

<script>
export default {
	transition: 'transition',
	async fetch({ app, store, params }) {
		const { data } = await app.$axios.$get(`/videos/${params.id}`);
		store.commit('VIDEO_SET', data);
	}
};
</script>

<style>
.transition-enter-active,
.transition-leave-active {
	transition: opacity 0.4s ease-out;
}
.transition-enter,
.transition-leave-active {
	opacity: 0;
}
</style>

<style scoped lang="scss">
iframe {
	min-height: 50vh;
}
</style>
