<template>
	<div>
		<VCardTitle class="display-1 white font-weight-black">
			<VLayout
				row
				nowrap
				align-center
			>
				<VFlex xs9>
					Joe Rogan Experience on steroids 💊
				</VFlex>
				<VFlex xs3>
					<VLayout
						row
						justify-end
					>
						<VBtn
							:loading="$store.state.stats === null"
							@click.native="openStats = !openStats"
						>
							Stats
						</VBtn>
						<VBtn to="/about">
							About
						</VBtn>
						<VBtn
							v-if="$store.state.user.identity"
							:loading="isLoadingAuth"
							:disabled="isLoadingAuth"
							@click.native="logout()"
						>
							Logout
						</VBtn>
						<VBtn
							v-else
							:loading="isLoadingAuth"
							:disabled="isLoadingAuth"
							@click.native="auth()"
						>
							Sign In/Up
						</VBtn>
					</VLayout>
				</VFlex>
			</VLayout>
		</VCardTitle>
		<VDialog
			v-if="$store.state.stats"
			v-model="openStats"
			@input="v => v || (openStats = false)"
		>
			<AppStats
				@selectHost="host => { $emit('selectHost', host); openStats = false; }"
				@selectKeyword="keyword => { $emit('selectKeyword', keyword); openStats = false; }"
				@selectVideo="video => { $store.commit('video', video); openStats = false; }"
			/>
		</VDialog>
	</div>
</template>

<script>
import AppStats from '~/components/AppStats.vue';

const netlifyIdentity = require('netlify-identity-widget');

export default {
	components: { AppStats },
	data() {
		return {
			// Toggle. True if we want to open statistics dialog.
			openStats: false,

			// Toggle. True if authorization process is running atm.
			isLoadingAuth: false,

			// Toggle. True if list of videos being loaded.
			isLoadingVideos: false,
		};
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
