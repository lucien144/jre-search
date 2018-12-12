<template>
	<div>
		<v-card-title class="display-1 white font-weight-black">
			<v-layout
				row
				nowrap
				align-center>
				<v-flex xs9>Joe Rogan Experience on steroids 💊</v-flex>
				<v-flex xs3>
					<v-layout
						row
						justify-end>
						<v-btn
							:loading="stats === null"
							@click.native="openStats = !openStats">Statistics</v-btn>
						<v-btn to="/about">About</v-btn>
						<v-btn
							v-if="$store.state.user.identity"
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
		<v-dialog
			v-if="stats"
			v-model="openStats"
			@input="v => v || (openStats = false)">
			<v-card>
				<v-card-title class="headline">Statistics</v-card-title>
				<v-card-text>
					<v-container
						fluid
						grid-list-lg>
						<v-layout>
							<v-flex xs4>
								<v-card>
									<v-card-title><h4>Top hosts ({{ stats.hosts.count }} total)</h4></v-card-title>
									<v-divider/>
									<v-list dense>
										<v-list-tile
											v-for="(item, index) in stats.hosts.top"
											:key="index"
											dark>
											<v-list-tile-content><a href="#">{{ item.original }} ({{ item.count }}&times;)</a></v-list-tile-content>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-flex>
							<v-flex xs4>
								<v-card>
									<v-card-title><h4>Top keywords ({{ stats.keywords.count }} total)</h4></v-card-title>
									<v-divider/>
									<v-list dense>
										<v-list-tile
											v-for="(item, index) in stats.keywords.top"
											:key="index">
											<v-list-tile-content>{{ item.original }} ({{ item.count }}&times;)</v-list-tile-content>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-flex>
							<v-flex xs4>
								<v-card>
									<v-card-title><h4>Top videos ({{ stats.videos.count }} total)</h4></v-card-title>
									<v-divider/>
									<v-list dense>
										<v-list-tile
											v-for="(item, index) in stats.videos.top"
											:key="index">

											<v-list-tile-content>
												#{{ item.title.episode }} - {{ item.title.hosts.join(', ') }}
											</v-list-tile-content>
											<v-list-tile-content class="align-end">
												{{ item.statistics.viewCount }}
											</v-list-tile-content>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import axios from 'axios';

const netlifyIdentity = require('netlify-identity-widget');

export default {
	data() {
		return {
			// Toggle. True if we want to open statistics dialog.
			openStats: false,

			// Toggle. True if authorization process is running atm.
			isLoadingAuth: false,

			// Toggle. True if list of videos being loaded.
			isLoadingVideos: false,

			// Statistics information
			stats: null
		};
	},
	async created() {
		const {data} = await axios.get(`${this.$store.getters.API}/stats`);
		this.stats = data.data;
	},
	methods: {
		// Sign in/up
		auth() {
			const self = this;
			if (!this.$store.state.user.identity) {
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

<style>

</style>
