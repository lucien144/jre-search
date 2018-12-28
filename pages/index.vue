<template>
	<div
		class="home"
	>
		<VCard>
			<AppHeader />
			<VCardText>
				Explore videos by entering host or either keyword/topic.
			</VCardText>
			<VLayout
				row
				wrap
			>
				<VFlex xs12 md6>
					<VCardText>
						<VAutocomplete
							v-model="selectedHost"
							:search-input.sync="host"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Find a host"
							placeholder="Elon Musk"
							prepend-icon="face"
						>
							<template
								slot="item"
								slot-scope="{ item, tile }"
							>
								<VListTileContent>
									<VListTileTitle v-text="item.original" />
								</VListTileContent>
								<VListTileAction>
									<VChip
										small
										color="primary"
										text-color="white"
									>
										{{ item.count }}
									</VChip>
								</VListTileAction>
							</template>
						</VAutocomplete>
					</VCardText>
				</VFlex>
				<VFlex xs12 md6>
					<VCardText>
						<VAutocomplete
							v-model="selectedKeyword"
							:search-input.sync="keyword"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Search for a topic or keyword"
							placeholder="neuroscientist"
							prepend-icon="wb_incandescent"
						>
							<template
								slot="item"
								slot-scope="{ item, tile }"
							>
								<VListTileContent>
									<VListTileTitle v-text="item.original" />
								</VListTileContent>
								<VListTileAction>
									<VChip
										small
										color="primary"
										text-color="white"
									>
										{{ item.count }}
									</VChip>
								</VListTileAction>
							</template>
						</VAutocomplete>
					</VCardText>
				</VFlex>
			</VLayout>
			<VProgressLinear :indeterminate="isLoadingVideos" />
		</VCard>

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
		<VideoDialog />
	</div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';
import VideoCard from '~/components/VideoCard.vue';
import VideoDialog from '~/components/VideoDialog.vue';

export default {
	components: { AppHeader, VideoCard, VideoDialog },
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
			const { data, pagination } = await app.$axios.$get(`${store.getters.API}/videos`);
			store.commit('VIDEOS_SET', data);
			store.commit('SET_PAGINATION', pagination);
	},

	methods: {
		async findKeywords(keyword, type) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(`${this.$store.getters.API}/${type}?search=${keyword}`);
			this.videos = data;
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async getKeywordVideos(id, type) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(
				`${this.$store.getters.API}/${type}/${id}`
			);
			this.$store.commit('VIDEOS_SET', data.videos);
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async loadVideos() {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(`${this.$store.getters.API}/videos`, {
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

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
html {
	font-size: 16px;
}
body {
	font-family: 'Catamaran', sans-serif;
	font-weight: 500;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
#app {
	background: #f7f7f7 url(~@/assets/pattern.svg);
}
</style>
