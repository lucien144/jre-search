<template>
	<div
		class="home"
	>
		<VContainer
			fluid
			grid-list-lg
		>
			<VLayout
				row
				wrap
			>
				<VFlex
					v-for="video in $store.getters.orderedVideos"
					:key="video.id"
					xs12
					md3
				>
					<VideoCard :video="video" />
				</VFlex>
			</VLayout>
			<VLayout>
				<VFlex xs12 text-xs-center>
					<VBtn v-if="$store.state.pagination.page < $store.state.pagination.pages" @click="loadVideos">
						Load More
					</VBtn>
				</VFlex>
			</VLayout>
		</VContainer>
	</div>
</template>

<script>
import VideoCard from '~/components/VideoCard.vue';

export default {
	components: { VideoCard },
	async fetch({ app, store }) {
		if (store.state.videos.length > 0) {
			return;
		}

		const videos = await app.$axios.$get(`/videos`);
		store.commit('VIDEOS_SET', videos.data);
		store.commit('SET_PAGINATION', videos.pagination);
	},
	methods: {
		async loadVideos() {
			const { data, pagination } = await this.$axios.$get(`/videos`, {
				params: {
					page: this.$store.state.pagination.page + 1
				}
			});
			this.$store.commit('VIDEOS_APPEND', data);
			this.$store.commit('SET_PAGINATION', pagination);
		}
	}
};
</script>
