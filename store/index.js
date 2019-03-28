export const state = () => ({
	autocomplete: {
		host: null, // Object. Reference to host
		keyword: null, // Object. Reference to keyword/tag
		type: null, // String. Reference to type of the search (host or keyword)
		hideWatched: false,
		/**
		 * Boolean. Toggle, if the reference to host/keyword was recently set.
		 * Autocomplete does not have fully functional @change, this is a workaround.
		 */
		toggled: false
	},

	// List of videos to display
	videos: [],

	// Currently watched video
	video: null,

	// Current pagination information
	pagination: {
		page: 1,
		pages: 1,
		count: null,
		path: null
	},

	// Statistics
	stats: null,

	// Logged user
	user: {
		identity: null,
		watched: [],
		favourites: []
	}
});

export const mutations = {
	VIDEOS_SET(state, videos) {
		state.videos = videos;
	},
	VIDEO_SET(state, video) {
		state.video = video;
	},
	VIDEOS_APPEND(state, videos) {
		state.videos = [...state.videos, ...videos];
	},
	SET_USER_WATCHED(state, watched) {
		state.user.watched = watched;
	},
	SET_USER_FAVOURITES(state, favourites) {
		state.user.favourites = favourites;
	},
	SET_PAGINATION(state, pagination) {
		state.pagination = pagination;
	},
	STATS_SET(state, stats) {
		state.stats = stats;
	},
	USER_IDENTITY_SET(state, identity) {
		state.user.identity = identity;
	},
	// Populates the autocomplete's host field
	SET_AUTOCOMPLETE_HOST(state, host) {
		state.autocomplete.host = host;
	},
	// Populates the autocomplete's keyword/tag field
	SET_AUTOCOMPLETE_KEYWORD(state, keyword) {
		state.autocomplete.keyword = keyword;
	},
	// Saves the autocomplete type (host/keyword)
	SET_AUTOCOMPLETE_TYPE(state, type) {
		state.autocomplete.type = type;
	},
	// Populates the autocomplete's toggle field
	SET_AUTOCOMPLETE_TOGGLE(state, toggle) {
		state.autocomplete.toggle = toggle;
	},
	// Toggle the switch if watched should be returned in videos
	SET_AUTOCOMPLETE_WATCHED(state, watched) {
		state.autocomplete.hideWatched = watched;
	}
};

export const actions = {
	async nuxtServerInit({ commit }, { app }) {
		const stats = await app.$axios.$get(`/stats`);
		commit('STATS_SET', stats.data);
	},
	async updateUser({ commit, getters }) {
		const { data } = await this.$axios.$get(`/users/${getters.userId}`);
		if (data) {
			if (data.watched) {
				commit('SET_USER_WATCHED', data.watched);
			}
			if (data.favourites) {
				commit('SET_USER_FAVOURITES', data.favourites);
			}
		}
	},

	/**
	 * Load videos for specific host or keyword/tag.
	 * Saves the host or keyword/tag reference in the store.
	 *
	 * @param {Object} context Nuxt context
	 * @param {Object} keywordType Keyword and the type.
	 */
	async getKeywordVideos({ commit, getters, state }, { keyword, type }) {
		this.$router.push('/');

		if (type === 'hosts') {
			commit('SET_AUTOCOMPLETE_HOST', keyword);
		} else if (type === 'keywords') {
			commit('SET_AUTOCOMPLETE_KEYWORD', keyword);
		} else {
			throw new Error('Unknown autocomplete type');
		}

		commit('SET_AUTOCOMPLETE_TYPE', type);
		commit('SET_AUTOCOMPLETE_TOGGLE', true);

		const { data, pagination } = await this.$axios.$get(`/${type}/${keyword._id}`, {
				params: {
					user_id:
						state.autocomplete.hideWatched ? getters.userId : null
				}
			}
		);
		commit('VIDEOS_SET', data.videos);
		commit('SET_PAGINATION', pagination);
	},

	/**
	 * Load all videos if search is not used.
	 *
	 * @param {*} { state, getters, commit }
	 * @param {*} [page=null]
	 */
	async loadVideos({ state, getters, commit }, page = null) {
		const hideWatched = process.client ? state.autocomplete.hideWatched : this.$cookies.get('toggleHideWatched');
		const { data, pagination } = await this.$axios.$get(`/videos`, {
			params: {
				page: page > 0 ? page : state.pagination.page + 1,
				user_id: hideWatched ? getters.userId : null
			}
		});

		commit(page > 0 ? 'VIDEOS_SET' : 'VIDEOS_APPEND', data);
		commit('SET_PAGINATION', pagination);
	},

	async toggleHideWatched({ commit, dispatch, state }, val) {
		commit('SET_AUTOCOMPLETE_WATCHED', val);
		this.$cookies.set('toggleHideWatched', val);
		const { type } = state.autocomplete;
		const keyword = type === 'hosts' ? state.autocomplete.host : state.autocomplete.keyword;
		if (type && keyword) {
			await dispatch('getKeywordVideos', { keyword, type });
		} else {
			await dispatch('loadVideos', 1);
		}
	},

	/**
	 * Save video to watched
	 *
	 * @param {Object} { state, getters, commit } Nuxt context
	 * @param {String} video Video ID
	 */
	async watch({ state, getters, commit }, video) {
		if (state.user.identity) {
			const { data } = await this.$axios.$post(`/users/watch`, {
				user: getters.userId,
				video: video.id
			});
			commit('SET_USER_WATCHED', data.watched);
		}
	},

	/**
	 * Save video to favourites
	 *
	 * @param {Object} { state, getters, commit } Nuxt context
	 * @param {String} video Video ID
	 */
	async favourite({ state, getters, commit }, video) {
		if (state.user.identity) {
			const { data } = await this.$axios.$post(`/users/favourite`, {
				user: getters.userId,
				video: video.id
			});
			commit('SET_USER_FAVOURITES', data.favourites);
		}
	}
};

export const getters = {
	orderedVideos(state) {
		const shallow = [...state.videos];
		return shallow.sort((a, b) => {
			return a.title.episode < b.title.episode
				? 1
				: a.title.episode > b.title.episode
					? -1
					: 0;
		});
	},
	userId(state) {
		if (state.user.identity) {
			return state.user.identity.user_id;
		}
		return null;
	}
};
