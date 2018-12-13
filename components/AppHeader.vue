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
							:loading="stats === null"
							@click.native="openStats = !openStats"
						>
							Statistics
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
			v-if="stats"
			v-model="openStats"
			@input="v => v || (openStats = false)"
		>
			<VCard>
				<VCardTitle class="headline">
					Statistics
				</VCardTitle>
				<VCardText>
					<VContainer
						fluid
						grid-list-lg
					>
						<VLayout>
							<VFlex xs4>
								<VCard>
									<VCardTitle><h4>Top hosts ({{ stats.hosts.count }} total)</h4></VCardTitle>
									<VDivider />
									<VList dense>
										<VListTile
											v-for="(item, index) in stats.hosts.top"
											:key="index"
											dark
										>
											<VListTileContent>
												<a href="#">
													{{ item.original }} ({{ item.count }}&times;)
												</a>
											</VListTileContent>
										</VListTile>
									</VList>
								</VCard>
							</VFlex>
							<VFlex xs4>
								<VCard>
									<VCardTitle><h4>Top keywords ({{ stats.keywords.count }} total)</h4></VCardTitle>
									<VDivider />
									<VList dense>
										<VListTile
											v-for="(item, index) in stats.keywords.top"
											:key="index"
										>
											<VListTileContent>{{ item.original }} ({{ item.count }}&times;)</VListTileContent>
										</VListTile>
									</VList>
								</VCard>
							</VFlex>
							<VFlex xs4>
								<VCard>
									<VCardTitle><h4>Top videos ({{ stats.videos.count }} total)</h4></VCardTitle>
									<VDivider />
									<VList dense>
										<VListTile
											v-for="(item, index) in stats.videos.top"
											:key="index"
										>
											<VListTileContent>
												#{{ item.title.episode }} - {{ item.title.hosts.join(', ') }}
											</VListTileContent>
											<VListTileContent class="align-end">
												{{ item.statistics.viewCount }}
											</VListTileContent>
										</VListTile>
									</VList>
								</VCard>
							</VFlex>
						</VLayout>
					</VContainer>
				</VCardText>
			</VCard>
		</VDialog>
	</div>
</template>

<script>
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
		const { data } = await this.$axios.$get(
			`${this.$store.getters.API}/stats`
		);
		this.stats = data;
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
