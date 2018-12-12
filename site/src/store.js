import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const netlifyIdentity = require('netlify-identity-widget');

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// List of videos to display
		videos: [],

		// Active video to play
		video: null,

		// Logged user
		user: {
			identity: null,
			watched: []
		}
	},
	mutations: {
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
	},
	actions: {
		async updateUser({state, commit, getters}, user) {
			commit('user', user);
			if (user) {
				const { data } = await axios.get(`${getters.API}/users/${user.id}`);
				commit('SET_USER_WATCHED', data.data.watched);
			}
		},
		auth({state, dispatch}) {
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
				const { data } = await axios.post(`${getters.API}/users/watch`, {
					user: state.user.identity.id,
					video: video.id
				});
				commit('SET_USER_WATCHED', data.data.watched);
			}
			dispatch('auth');
		}
	},
	getters: {
		API: _ => {
			return 'http://localhost:8000';
		},
		orderedVideos(state) {
			return state.videos.sort((a, b) => {
				return a.title.episode < b.title.episode ? 1 : (a.title.episode > b.title.episode ? -1 : 0);
			});
		}
	}
});
