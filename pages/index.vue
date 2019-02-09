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
		</VContainer>
		<VBtn v-if="$store.state.pagination.page < $store.state.pagination.pages" @click="loadVideos">Load More</VBtn>
	</div>
</template>

<script>
import VideoCard from '~/components/VideoCard.vue';

export default {
	components: { VideoCard },
	data() {
		return {
			videos: [],
			host: '',
			selectedHost: null,
			keyword: '',
			selectedKeyword: null,
			isLoadingVideos: false
		};
	},
	watch: {
		host(val) {
			return val && this.findKeywords(val, 'hosts');
		},
		selectedHost(val) {
			return val && this.getKeywordVideos(val, 'hosts');
		},
		keyword(val) {
			return val && this.findKeywords(val, 'keywords');
		},
		selectedKeyword(val) {
			return val && this.getKeywordVideos(val, 'keywords');
		}
	},

	async fetch({ app, store }) {
		const p1 = app.$axios.$get(`/videos`);
		const p2 = app.$axios.$get(`/stats`);
		const [videos, stats] = await Promise.all([p1, p2]);
		store.commit('VIDEOS_SET', videos.data);
		store.commit('SET_PAGINATION', videos.pagination);
		store.commit('STATS_SET', stats.data);
	},

	methods: {
		async findKeywords(keyword, type) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(`/${type}?search=${keyword}`);
			this.videos = data;
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async getKeywordVideos(id, type) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(
				`/${type}/${id}`
			);
			this.$store.commit('VIDEOS_SET', data.videos);
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async loadVideos() {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(`/videos`, {
				params: {
					page: this.$store.state.pagination.page + 1
				}
			});
			this.$store.commit('VIDEOS_APPEND', data);
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		}
	}
};
</script>
