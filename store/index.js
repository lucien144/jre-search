export const state = () => ({
	// List of videos to display
	videos: [],

	// Active video to play
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
		watched: []
	}
});

export const mutations = {
	VIDEOS_SET(state, videos) {
		state.videos = videos;
	},
	VIDEOS_APPEND(state, videos) {
		state.videos = [...state.videos, ...videos];
	},
	video(state, video) {
		state.video = video;
	},
	SET_USER_WATCHED(state, watched) {
		state.user.watched = watched;
	},
	SET_PAGINATION(state, pagination) {
		state.pagination = pagination;
	},
	STATS_SET(state, stats) {
		state.stats = stats;
	}
};
export const actions = {
	async updateUser({ commit, getters }) {
		const { data } = await this.$axios.$get(
			`${getters.API}/users/${getters.userId}`
		);
		commit('SET_USER_WATCHED', data.watched);
	},
	async watch({ state, dispatch, getters, commit }, video) {
		if (state.auth.user) {
			const { data } = await this.$axios.$post(
				`${getters.API}/users/watch`,
				{
					user: getters.userId,
					video: video.id
				}
			);
			commit('SET_USER_WATCHED', data.watched);
		}
	}
};

export const getters = {
	API: _ => {
		return 'http://127.0.0.1:3000/api';
	},
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
		if (state.auth.user) {
			return state.auth.user.sub.replace(/google-oauth2\|/, '');
		}
		return null;
	}
};
