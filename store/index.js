const netlifyIdentity = require('netlify-identity-widget');

export const state = () => ({
	// List of videos to display
	videos: [],

	// Active video to play
	video: null,

	// Logged user
	user: {
		identity: null,
		watched: []
	}
});

export const mutations = {
	videos(state, videos) {
		state.videos = videos;
	},
	video(state, video) {
		state.video = video;
	},
	user(state, user) {
		state.user.identity = user;
	},
	SET_USER_WATCHED(state, watched) {
		state.user.watched = watched;
	}
};
export const actions = {
	async updateUser({ commit, getters }, user) {
		commit('user', user);
		if (user) {
			const { data } = await this.$axios.$get(
				`${getters.API}/users/${user.id}`
			);
			commit('SET_USER_WATCHED', data.watched);
		}
	},
	auth({ state, dispatch }) {
		if (!state.user.identity) {
			netlifyIdentity.on('login', user => {
				dispatch('updateUser', user);
				netlifyIdentity.close();
			});
			netlifyIdentity.open();
		}
	},
	async watch({ state, dispatch, getters, commit }, video) {
		if (state.user.identity) {
			const { data } = await this.$axios.$post(
				`${getters.API}/users/watch`,
				{
					user: state.user.identity.id,
					video: video.id
				}
			);
			commit('SET_USER_WATCHED', data.watched);
		}
		dispatch('auth');
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
	}
};
