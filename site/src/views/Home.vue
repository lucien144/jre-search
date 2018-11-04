<template>
	<div
		class="home">
		<v-card
			color="red darken-3"
			dark>
			<v-card-title class="headline red darken-1">
				Joe Rogan Experience podcast on 🚀 🍄
			</v-card-title>
			<v-card-text>
				Explore videos by entering host or either keyword/topic.
			</v-card-text>
			<v-layout
				row
				wrap>
				<v-flex xs6>
					<v-card-text>
						<v-autocomplete
							v-model="model"
							:search-input.sync="keyword"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Find a host"
							placeholder="Elon Musk"
							prepend-icon="mdi-database-search"
						/>
					</v-card-text>
				</v-flex>
				<v-flex xs6>
					<v-card-text>
						<v-autocomplete
							v-model="model"
							:search-input.sync="keyword"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Find a topic"
							placeholder="actor"
							prepend-icon="mdi-database-search"
						/>
					</v-card-text>
				</v-flex>
			</v-layout>
		</v-card>

		<v-container
			fluid
			grid-list-lg>
			<v-layout
				row
				wrap>
				<v-flex
					v-for="video in $store.state.videos"
					:key="video.id"
					xs12
					md3>
					<video-card :video="video"/>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import axios from 'axios';
import VideoCard from '../components/VideoCard.vue';

export default {
	components: {VideoCard},
	data() {
		return {
			model: null,
			videos: [],
			keyword: ''
		};
	},
	watch: {
		keyword(val) {
			return val && this.loadVideos(val);
		},
		model(val) {
			return val && this.loadDetail(val);
		}
	},
	methods: {
		async loadVideos(keyword) {
			const {data} = await axios.get(`${this.$store.getters.API}/hosts?search=${keyword}`);
			this.videos = data.data;
		},
		async loadDetail(id) {
			const {data} = await axios.get(`${this.$store.getters.API}/hosts/${id}`);
			this.$store.commit('videos', data.data.videos);
		}
	}
};
</script>

<style lang="less" scoped>
  .autocomplete { width: 80vw; }
</style>
