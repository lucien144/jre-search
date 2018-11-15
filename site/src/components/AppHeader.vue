<template>
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
</template>

<script>
const netlifyIdentity = require('netlify-identity-widget');

export default {
	data() {
		return {
			// Toggle. True if authorization process is running atm.
			isLoadingAuth: false,

			// Toggle. True if list of videos being loaded.
			isLoadingVideos: false
		};
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
}
</script>

<style>

</style>
