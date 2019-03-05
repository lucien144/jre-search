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
				login() {},
				logout() {}
			}
		})
	);

	if (process.server) {
		return;
	}

	const cookieName = 'lockAuth0';
	const { cid, domain, options } = env.lock;
	const lock = new Auth0Lock(cid, domain, options);

	const error = err => {
		console.log(err);
		app.$lock.isLoadingAuth = false;
	};

	const signIn = token => {
		app.$lock.isLoadingAuth = true;

		lock.getUserInfo(token, (err, profile) => {
			if (err === null) {
				app.$cookies.set(cookieName, token);
				app.$lock.user = profile;
				app.$lock.loggedIn = true;
				app.$lock.isLoadingAuth = false;
				app.$lock.$emit('authenticated', profile);
			} else {
				error(err);
			}
		});
	};

	const signOut = () => {
		app.$lock.user = null;
		app.$lock.loggedIn = false;
		app.$cookies.remove(cookieName);
		app.$lock.isLoadingAuth = false;
		app.$lock.$emit('logout');
	};

	lock.on('authenticated', authResult => {
		signIn(authResult.accessToken);
	});

	lock.on('authorization_error', err => {
		error(err);
	});

	lock.on('hide', () => {
		app.$lock.isLoadingAuth = false;
	});

	app.$lock.login = () => {
		app.$lock.isLoadingAuth = true;
		lock.show();
	};
	app.$lock.logout = () => {
		app.$lock.isLoadingAuth = true;
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
			app.$lock.isLoadingAuth = false;
		}
	}
};
