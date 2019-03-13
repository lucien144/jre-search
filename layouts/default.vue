<template>
	<VApp>
		<VContainer fluid>
			<VCard>
				<AppHeader />
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
								:items="videos.hosts"
								item-text="original"
								item-value="_id"
								label="Find a host"
								placeholder="Elon Musk"
								prepend-icon="fas fa-user-circle"
								append-icon="fas fa-caret-down"
								no-data-text="Type in a host's name first."
								return-object
								:clearable="true"
								clear-icon="fas fa-times"
								@click:clear="clear"
								@change="keywordSelected = true"
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
								:items="videos.keywords"
								item-text="original"
								item-value="_id"
								label="Search for a topic or keyword"
								placeholder="neuroscientist"
								prepend-icon="fas fa-lightbulb"
								append-icon="fas fa-caret-down"
								no-data-text="Type in any keyword first."
								return-object
								:clearable="true"
								clear-icon="fas fa-times"
								@click:clear="clear"
								@change="keywordSelected = true"
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
			videos: {
				hosts: [],
				keywords: []
			},
			host: '',
			keyword: '',
			keywordSelected: false
		};
	},
	computed: {
		selectedHost: {
			get() {
				if (this.$store.state.autocomplete.host) {
					this.videos.keywords = []; // eslint-disable-line vue/no-side-effects-in-computed-properties
					this.videos.hosts = [this.$store.state.autocomplete.host]; // eslint-disable-line vue/no-side-effects-in-computed-properties
				}
				return this.$store.state.autocomplete.host;
			},
			set(val) {
				if (val) {
					this.$store.dispatch('getKeywordVideos', {
						keyword: val,
						type: 'hosts'
					});
				} else {
					this.$store.commit('SET_AUTOCOMPLETE_HOST', null);
					this.loadVideos(1);
				}
			}
		},
		selectedKeyword: {
			get() {
				if (this.$store.state.autocomplete.keyword) {
					this.videos.hosts = []; // eslint-disable-line vue/no-side-effects-in-computed-properties
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.videos.keywords = [
						this.$store.state.autocomplete.keyword
					];
				}
				return this.$store.state.autocomplete.keyword;
			},
			set(val) {
				if (val) {
					this.$store.dispatch('getKeywordVideos', {
						keyword: val,
						type: 'keywords'
					});
				} else {
					this.$store.commit('SET_AUTOCOMPLETE_KEYWORD', null);
					this.loadVideos(1);
				}
			}
		}
	},
	watch: {
		host(val) {
			if (this.keywordSelected || val === null) {
				this.keywordSelected = false;
				return;
			}

			if (val === '') {
				return this.clear();
			}
			return this.findKeywords(val, 'hosts');
		},
		keyword(val) {
			if (this.keywordSelected || val === null) {
				this.keywordSelected = false;
				return;
			}

			if (val === '') {
				return this.clear();
			}
			return this.findKeywords(val, 'keywords');
		}
	},
	methods: {
		async findKeywords(keyword, type) {
			const { data, pagination } = await this.$axios.$get(
				`/${type}?search=${keyword}`
			);
			this.videos[type] = data;
			this.$store.commit('SET_PAGINATION', pagination);
		},

		clear(_) {
			this.videos.hosts = [];
			this.videos.keywords = [];
			this.loadVideos(1);
		},

		async loadVideos(page = null) {
			const { data, pagination } = await this.$axios.$get(`/videos`, {
				params: {
					page:
						page > 0 ? page : this.$store.state.pagination.page + 1
				}
			});
			this.$store.commit(page > 0 ? 'VIDEOS_SET' : 'VIDEOS_APPEND', data);
			this.$store.commit('SET_PAGINATION', pagination);
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
