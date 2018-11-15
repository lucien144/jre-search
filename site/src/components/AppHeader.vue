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
						<v-btn @click.native="openStats = !openStats">Statistics</v-btn>
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
		<v-dialog
			v-model="openStats"
			@input="v => v || (openStats = false)">>
			<v-card>
				<h2>Statistics</h2>
				<p>Total hosts: {{ stats.hosts }}</p>
				<p>Total keywords: {{ stats.keywords }}</p>
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
			stats: {}
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

<style>

</style>
