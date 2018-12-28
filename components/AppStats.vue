<template>
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
							<VCardTitle><h4>Top hosts ({{ $store.state.stats.hosts.count }} total)</h4></VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(item, index) in $store.state.stats.hosts.top"
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
							<VCardTitle><h4>Top keywords ({{ $store.state.stats.keywords.count }} total)</h4></VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(item, index) in $store.state.stats.keywords.top"
									:key="index"
								>
									<VListTileContent>{{ item.original }} ({{ item.count }}&times;)</VListTileContent>
								</VListTile>
							</VList>
						</VCard>
					</VFlex>
					<VFlex xs4>
						<VCard>
							<VCardTitle><h4>Top videos ({{ $store.state.stats.videos.count }} total)</h4></VCardTitle>
							<VDivider />
							<VList dense>
								<VListTile
									v-for="(item, index) in $store.state.stats.videos.top"
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
</template>

<script>
export default {
}
</script>

<style>

</style>
