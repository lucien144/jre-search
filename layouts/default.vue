<template>
	<VApp>
		<VContainer fluid>
			<VCard>
				<AppHeader
					@selectHost="item => { selectedHost = item._id; host = item.original }"
					@selectKeyword="item => { selectedKeyword = item._id; keyword = item.original }"
				/>
				<VCardText>
					Explore videos by entering host or either keyword/topic.
				</VCardText>
				<VLayout
					row
					wrap
				>
					<VFlex xs12 md6>
						<VCardText>
							<VAutocomplete
								v-model="selectedHost"
								:search-input.sync="host"
								:items="videos"
								item-text="original"
								item-value="_id"
								label="Find a host"
								placeholder="Elon Musk"
								prepend-icon="fas fa-user-circle"
								append-icon="fas fa-caret-down"
								:clearable="true"
								clear-icon="fas fa-times"
							>
								<template
									slot="item"
									slot-scope="{ item }"
								>
									<VListTileContent>
										<VListTileTitle v-text="item.original" />
									</VListTileContent>
									<VListTileAction>
										<VChip
											small
											color="primary"
											text-color="white"
										>
											{{ item.count }}
										</VChip>
									</VListTileAction>
								</template>
							</VAutocomplete>
						</VCardText>
					</VFlex>
					<VFlex xs12 md6>
						<VCardText>
							<VAutocomplete
								v-model="selectedKeyword"
								:search-input.sync="keyword"
								:items="videos"
								item-text="original"
								item-value="_id"
								label="Search for a topic or keyword"
								placeholder="neuroscientist"
								prepend-icon="fas fa-lightbulb"
								append-icon="fas fa-caret-down"
								:clearable="true"
								clear-icon="fas fa-times"
							>
								<template
									slot="item"
									slot-scope="{ item }"
								>
									<VListTileContent>
										<VListTileTitle v-text="item.original" />
									</VListTileContent>
									<VListTileAction>
										<VChip
											small
											color="primary"
											text-color="white"
										>
											{{ item.count }}
										</VChip>
									</VListTileAction>
								</template>
							</VAutocomplete>
						</VCardText>
					</VFlex>
				</VLayout>
				<VProgressLinear :indeterminate="isLoadingVideos" />
			</VCard>
			<!-- eslint-disable-next-line vue/component-name-in-template-casing //-->
			<nuxt />
		</VContainer>
	</VApp>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';

export default {
	components: { AppHeader },
	data() {
		return {
			videos: [],
			host: '',
			selectedHost: null,
			keyword: '',
			selectedKeyword: null,
			isLoadingVideos: false
		};
	},
	watch: {
		host(val) {
			if (val === '') {
				this.loadVideos(1);
				return;
			}
			return val && this.findKeywords(val, 'hosts');
		},
		selectedHost(val) {
			if (!val) {
				this.loadVideos(1);
				return;
			}

			return val && this.getKeywordVideos(val, 'hosts');
		},
		keyword(val) {
			if (val === '') {
				this.loadVideos(1);
				return;
			}
			return val && this.findKeywords(val, 'keywords');
		},
		selectedKeyword(val) {
			if (!val) {
				this.loadVideos(1);
				return;
			}

			return val && this.getKeywordVideos(val, 'keywords');
		}
	},

	methods: {
		async findKeywords(keyword, type) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(
				`/${type}?search=${keyword}`
			);
			this.videos = data;
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async getKeywordVideos(id, type) {
			this.$router.push('/');

			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(
				`/${type}/${id}`
			);
			this.$store.commit('VIDEOS_SET', data.videos);
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		},
		async loadVideos(page = null) {
			this.isLoadingVideos = true;
			const { data, pagination } = await this.$axios.$get(`/videos`, {
				params: {
					page: page > 0 ? page : this.$store.state.pagination.page + 1
				}
			});
			this.$store.commit(page > 0 ? 'VIDEOS_SET' : 'VIDEOS_APPEND', data);
			this.$store.commit('SET_PAGINATION', pagination);
			this.isLoadingVideos = false;
		}
	}
};
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
html {
	font-size: 16px;
}
body {
	font-family: 'Catamaran', sans-serif;
	font-weight: 500;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
#app {
	background: #f7f7f7 url(~@/assets/pattern.svg);
}
</style>
