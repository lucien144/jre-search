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
					md4
					lg3
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
	methods: {
		async loadVideos() {
			const { state, getters, commit } = this.$store;
			const { data, pagination } = await this.$axios.$get(
				state.pagination.path,
				{
					params: {
						page: state.pagination.page + 1,
						user_id: state.autocomplete.hideWatched // eslint-disable-line camelcase
							? getters.userId
							: null
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
