<template>
	<div
		id="video"
		class="video mt-4"
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
				<VSpacer />
				<ShareBar :video="$store.state.video" />
			</VCardTitle>
			<VCardText class="pb-0">
				<VContainer py-0 px-3 fluid grid-list-xl>
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
									:key="`k${index}`"
									@click="onChipClick(keyword, 'keywords')"
									small
								>
									{{ keyword.original }}
								</VChip>
								<VChip
									v-for="(host, index) in $store.state.video.hosts"
									:key="`h${index}`"
									@click="onChipClick(host, 'hosts')"
									small
								>
									{{ host.original }}
								</VChip>
							</p>
						</VFlex>
					</VLayout>
				</VContainer>
			</VCardText>
			<VCardActions>
				<VSpacer />
				<div class="stats">
					<VChip label color="white" small>
						<VIcon left small>
							fas fa-eye
						</VIcon>{{ $store.state.video.statistics.viewCount | format }}
					</VChip>
					<VChip label color="white" small>
						<VIcon left small>
							fas fa-thumbs-up
						</VIcon>{{ $store.state.video.statistics.likeCount | format }}
					</VChip>
					<VChip label color="white" small>
						<VIcon left small>
							fas fa-thumbs-down
						</VIcon>{{ $store.state.video.statistics.dislikeCount | format }}
					</VChip>
					<VChip label color="white" small>
						<VIcon left small>
							fas fa-comment-alt
						</VIcon>{{ $store.state.video.statistics.commentCount | format }}
					</VChip>
				</div>
			</VCardActions>
		</VCard>
	</div>
</template>

<script>
import ShareBar from '@/components/ShareBar.vue';

export default {
	components: { ShareBar },
	transition: 'transition',
	async fetch({ app, store, params }) {
		const { data } = await app.$axios.$get(`/videos/${params.id}`);
		store.commit('VIDEO_SET', data);
	},
	methods: {
		onChipClick(keyword, type) {
			this.$store.dispatch('getKeywordVideos', { keyword, type });
		}
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

.stats {
	opacity: .6;
}
</style>

<style scoped lang="scss">
iframe {
	min-height: 50vh;
}
.v-chip {
	/deep/ .v-chip__content {
		cursor: pointer;
	}
}
</style>
