<template>
	<div
		class="home">
		<v-card>
			<app-header/>
			<v-card-text>
				Explore videos by entering host or either keyword/topic.
			</v-card-text>
			<v-layout
				row
				wrap>
				<v-flex xs6>
					<v-card-text>
						<v-autocomplete
							v-model="selectedHost"
							:search-input.sync="host"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Find a host"
							placeholder="Elon Musk"
							prepend-icon="face">
							<template
								slot="item"
								slot-scope="{ item, tile }"
							>
								<v-list-tile-content>
									<v-list-tile-title v-text="item.original"/>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-chip
										small
										color="primary"
										text-color="white">{{ item.count }}</v-chip>
								</v-list-tile-action>
							</template>
						</v-autocomplete>
					</v-card-text>
				</v-flex>
				<v-flex xs6>
					<v-card-text>
						<v-autocomplete
							v-model="selectedKeyword"
							:search-input.sync="keyword"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Search for a topic or keyword"
							placeholder="neuroscientist"
							prepend-icon="wb_incandescent">
							<template
								slot="item"
								slot-scope="{ item, tile }"
							>
								<v-list-tile-content>
									<v-list-tile-title v-text="item.original"/>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-chip
										small
										color="primary"
										text-color="white">{{ item.count }}</v-chip>
								</v-list-tile-action>
							</template>
						</v-autocomplete>
					</v-card-text>
				</v-flex>
			</v-layout>
			<v-progress-linear :indeterminate="isLoadingVideos"/>
		</v-card>

		<v-container
			fluid
			grid-list-lg>
			<v-layout
				row
				wrap>
				<v-flex
					v-for="video in $store.getters.orderedVideos"
					:key="video.id"
					xs12
					md3>
					<video-card :video="video"/>
				</v-flex>
			</v-layout>
		</v-container>
		<v-btn>Load More</v-btn>
		<video-dialog/>
	</div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';
import VideoCard from '~/components/VideoCard.vue';
import VideoDialog from '~/components/VideoDialog.vue';

export default {
	components: {AppHeader, VideoCard, VideoDialog},
	data() {
		return {
			videos: [],
			host: '',
			selectedHost: null,
			keyword: '',
			selectedKeyword: null
		};
	},
	watch: {
		host(val) {
			return val && this.loadVideos(val, 'hosts');
		},
		selectedHost(val) {
			return val && this.loadDetail(val, 'hosts');
		},
		keyword(val) {
			return val && this.loadVideos(val, 'keywords');
		},
		selectedKeyword(val) {
			return val && this.loadDetail(val, 'keywords');
		}
	},

	async created() {
		this.isLoadingVideos = true;
		const {data} = await this.$axios.$get(`${this.$store.getters.API}/videos`);
		this.$store.commit('videos', data);
		this.isLoadingVideos = false;
	},

	methods: {
		async loadVideos(keyword, type) {
			const {data} = await this.$axios.$get(`${this.$store.getters.API}/${type}?search=${keyword}`);
			this.videos = data;
		},
		async loadDetail(id, type) {
			this.isLoadingVideos = true;
			const {data} = await this.$axios.$get(`${this.$store.getters.API}/${type}/${id}`);
			this.$store.commit('videos', data.videos);
			this.isLoadingVideos = false;
		}
	}
};
</script>

<style lang="scss">
* { margin: 0; padding: 0; box-sizing: border-box; }
html {
  font-size: 16px;
}
body {
  font-family: 'Catamaran', sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
#app { background: #f7f7f7 url(~@/assets/pattern.svg); }
</style>
