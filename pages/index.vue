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
				<VFlex xs12 text-xs-center v-if="$store.state.loadingVideos">
					<VProgressCircular
						color="grey"
						:size="70"
						:width="7"
						indeterminate
					/>
				</VFlex>
				<template v-else>
					<VFlex
						v-for="video in $store.getters.orderedVideos"
						:key="video.id"
						xs12
						md4
						lg3
					>
						<VideoCard :video="video" />
					</VFlex>
				</template>
			</VLayout>
			<VLayout>
				<VFlex xs12 text-xs-center>
					<VBtn
						v-if="$store.state.pagination.page < $store.state.pagination.pages"
						@click="loadVideos"
						:loading="loadingVideos"
					>
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
	data() {
		return {
			loadingVideos: false
		};
	},
	methods: {
		async loadVideos() {
			this.loadingVideos = true;
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
			this.loadingVideos = false;
		}
	}
};
</script>
