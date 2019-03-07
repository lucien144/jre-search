export const state = () => ({
	// List of videos to display
	videos: [],

	// Currently watched video
	video: null,

	// Current pagination information
	pagination: {
		page: 1,
		pages: 1,
		count: null
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
	async watch({ state, getters, commit }, video) {
		if (state.user.identity) {
			const { data } = await this.$axios.$post(`/users/watch`, {
				user: getters.userId,
				video: video.id
			});
			commit('SET_USER_WATCHED', data.watched);
		}
	},
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
			return state.user.identity.sub.replace(/[^a-z0-9]/gi, '_');
		}
		return null;
	}
};
