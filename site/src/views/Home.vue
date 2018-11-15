<template>
	<div
		class="home">
		<v-card>
			<v-card-title class="display-1 white font-weight-black">
				<v-layout
					row
					nowrap
					align-center>
					<v-flex xs9>Joe Rogan Experience on Steroids 💊</v-flex>
					<v-flex xs3>
						<v-layout
							row
							justify-end>
							<v-btn to="/statistics">Statistics</v-btn>
							<v-btn to="/about">About</v-btn>
							<v-btn
								v-if="$store.state.user"
								:loading="isLoadingAuth"
								:disabled="isLoadingAuth"
								@click.native="logout()">Logout</v-btn>
							<v-btn
								v-else
								:loading="isLoadingAuth"
								:disabled="isLoadingAuth"
								@click.native="auth()">Sign In/Up</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
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
							v-model="selectedHost"
							:search-input.sync="host"
							:items="videos"
							item-text="original"
							item-value="_id"
							label="Find a host"
							placeholder="Elon Musk"
							prepend-icon="mdi-database-search">
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
							prepend-icon="mdi-database-search">
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
		<v-dialog
			v-if="$store.state.video"
			v-model="$store.state.video"
			@input="v => v || $store.commit('video', null)">
			<v-card>
				<iframe
					:src="`https://www.youtube.com/embed/${$store.state.video.id}?autoplay=1`"
					type="text/html"
					width="100%"
					height="360"
					frameborder="0"/>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import VideoCard from '../components/VideoCard.vue';

const netlifyIdentity = require('netlify-identity-widget');

export default {
	components: {VideoCard},
	data() {
		return {
			videos: [],
			host: '',
			selectedHost: null,
			keyword: '',
			selectedKeyword: null,

			// Toggle. True if authorization process is running atm.
			isLoadingAuth: false
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
		const {data} = await axios.get(`${this.$store.getters.API}/videos`);
		this.$store.commit('videos', data.data);
	},

	methods: {
		async loadVideos(keyword, type) {
			const {data} = await axios.get(`${this.$store.getters.API}/${type}?search=${keyword}`);
			this.videos = data.data;
		},
		async loadDetail(id, type) {
			const {data} = await axios.get(`${this.$store.getters.API}/${type}/${id}`);
			this.$store.commit('videos', data.data.videos);
		},

		// Sign in/up
		auth() {
			const self = this;
			if (!this.$store.state.user) {
				netlifyIdentity.on('login', user => {
					self.$store.commit('user', user);
					netlifyIdentity.close();
				});
				netlifyIdentity.open();
			}
		},

		// Logout
		logout() {
			const self = this;
			netlifyIdentity.on('logout', user => {
				self.$store.commit('user', user);
				self.isLoadingAuth = false;
			});
			self.isLoadingAuth = true;
			netlifyIdentity.logout();
		}
	}
};
</script>

<style lang="less" scoped>
</style>
