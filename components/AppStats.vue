<template>
	<VCard dark>
		<VCardText>
			<VContainer
				fluid
				grid-list-lg
			>
				<VLayout row wrap align-center>
					<VFlex xs8>
						<h3 class="headline mb-0">
							Statistics
						</h3>
					</VFlex>
					<VFlex xs4 text-xs-right>
						<VBtn
							fab
							small
							light
							@click="$emit('close')"
						>
							<VIcon>fas fa-times</VIcon>
						</VBtn>
					</VFlex>
				</VLayout>
				<VLayout row wrap>
					<VFlex xs12 md4>
						<VCard light>
							<VCardTitle>
								<h4>Top 20 hosts ({{ $store.state.stats.hosts.count }} total)</h4>
							</VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(item, index) in $store.state.stats.hosts.top"
									:key="index"
								>
									<VListTileContent>
										<a href="#" @click.prevent="onKeywordClick(item, 'hosts')">
											{{ item.original }}
										</a>
									</VListTileContent>
									<VListTileAction>
										{{ item.count }}&times;
									</VListTileAction>
								</VListTile>
							</VList>
							<VCardActions>
								<!--VBtn to="/hosts">View all {{ $store.state.stats.hosts.count }} hosts</VBtn//-->
							</VCardActions>
						</VCard>
					</VFlex>
					<VFlex xs12 md4>
						<VCard light>
							<VCardTitle><h4>Top 20 keywords ({{ $store.state.stats.keywords.count }} total)</h4></VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(item, index) in $store.state.stats.keywords.top"
									:key="index"
								>
									<VListTileContent>
										<a href="#" @click.prevent="onKeywordClick(item, 'keywords')">
											{{ item.original }}
										</a>
									</VListTileContent>
									<VListTileAction>
										{{ item.count }}&times;
									</VListTileAction>
								</VListTile>
							</VList>
							<VCardActions>
								<!--VBtn to="/keywords">View all {{ $store.state.stats.keywords.count }} keywords</VBtn//-->
							</VCardActions>
						</VCard>
					</VFlex>
					<VFlex xs12 md4>
						<VCard light>
							<VCardTitle><h4>Top 20 videos ({{ $store.state.stats.videos.count }} total)</h4></VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(video, index) in $store.state.stats.videos.top"
									:key="index"
								>
									<VListTileContent>
										<a href="#" @click.prevent="onVideoSelect(video)">
											#{{ video.title.episode }} - {{ video.title.hosts.join(', ') }}
										</a>
									</VListTileContent>
									<VListTileAction>
										<span>
											<VIcon :size="16" left>
												fas fa-eye
											</VIcon>
											{{ video.statistics.viewCount | format }}
										</span>
									</VListTileAction>
								</VListTile>
							</VList>
							<VCardActions>
								<!--VBtn to="/videos">View all {{ $store.state.stats.videos.count }} videos</VBtn//-->
							</VCardActions>
						</VCard>
					</VFlex>
				</VLayout>
			</VContainer>
		</VCardText>
	</VCard>
</template>

<script>
export default {
	methods: {
		onKeywordClick(keyword, type) {
			this.$store.dispatch('getKeywordVideos', { keyword, type });
			this.$emit('close');
		},
		onVideoSelect(video) {
			this.$router.push(`/video/${video.id}/#video`);
			this.$emit('close');
		}
	}
};
</script>

<style>
</style>
