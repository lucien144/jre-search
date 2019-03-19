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

		const { data, pagination } = await app.$axios.$get(`/videos`, {
			params: {
				userId: app.$cookies.get('userId')
			}
		});
		store.commit('VIDEOS_SET', data);
		store.commit('SET_PAGINATION', pagination);
	},
	methods: {
		async loadVideos() {
			const { state, getters, commit } = this.$store;
			const { data, pagination } = await this.$axios.$get(
				state.pagination.path,
				{
					params: {
						page: state.pagination.page + 1,
						user_id: state.autocomplete.hideWatched ? getters.userId : null
					}
				}
			);
			commit(
				'VIDEOS_APPEND',
				Object.prototype.hasOwnProperty.call(data, 'videos')
					? data.videos
					: data
			);
			commit('SET_PAGINATION', pagination);
		}
	}
};
</script>
