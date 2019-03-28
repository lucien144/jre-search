import Vue from 'vue';
import Auth0Lock from 'auth0-lock';

export default ({ app, env }, inject) => {
	inject(
		'lock',
		new Vue({
			data: {
				loggedIn: false,
				user: null,
				isLoadingAuth: true
			},
			methods: {
				init() {
					if (process.server) {
						return;
					}

					const self = this;
					const cookieName = 'lockAuth0';
					const { cid, domain, options } = env.lock;
					const lock = new Auth0Lock(cid, domain, options);

					const error = err => {
						console.log(err);
						signOut();
					};

					const finished = () => {
						self.isLoadingAuth = false;
						self.$emit('finished');
					};

					const signIn = token => {
						self.isLoadingAuth = true;

						lock.getUserInfo(token, (err, profile) => {
							if (err === null) {
								app.$cookies.set(cookieName, token);
								profile.user_id = profile.sub.replace(/[^a-z0-9]/gi, '_'); // eslint-disable-line camelcase
								self.user = profile;
								self.loggedIn = true;
								self.$emit('authenticated', profile);
								finished();
							} else {
								error(err);
							}
						});
					};

					const signOut = () => {
						self.user = null;
						self.loggedIn = false;
						app.$cookies.remove(cookieName);
						self.$emit('logout');
						finished();
					};

					lock.on('authenticated', authResult => {
						signIn(authResult.accessToken);
					});

					lock.on('authorization_error', err => {
						error(err);
					});

					lock.on('hide', () => {
						finished();
					});

					self.login = () => {
						self.isLoadingAuth = true;
						lock.show();
					};
					self.logout = () => {
						self.isLoadingAuth = true;
						signOut();
						lock.logout({
							returnTo: window.location.href
						});
					};

					const token = app.$cookies.get(cookieName);
					if (token) {
						signIn(token);
					} else {
						const hash = window.location.hash
							.slice(1)
							.split('&')
							.map(i => i.split('='))
							.flat();
						// If the access token is present, avoid reseting the loading.
						// Reason is, the "authenticated" event might have not finished yet.
						if (hash.indexOf('access_token') === -1) {
							finished();
						}
					}
				},
				login() {},
				logout() {}
			}
		})
	);
};
