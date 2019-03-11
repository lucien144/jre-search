require('dotenv').config();
const pkg = require('./package');

module.exports = {
	mode: 'universal',

	env: {
		lock: {
			domain: process.env.LOCK_DOMAIN,
			cid: process.env.LOCK_CLIENT_ID,
			options: {
				allowShowPassword: true
			}
		}
	},

	/*
  ** Headers of the page
  */
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: pkg.description
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
			},
			{
				rel: 'stylesheet',
				href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css'
			}
		]
	},

	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#000' },

	/*
  ** Global CSS
  */
	css: ['~/assets/style/app.styl'],

	/*
	** Plugins to load before mounting the App
	*/
	plugins: ['@/plugins/vuetify', '@/plugins/filters', '@/plugins/lock'],

	/*
  ** Nuxt.js modules
  */
	modules: [
		// Doc: https://github.com/nuxt-community/axios-module#usage
		'@nuxtjs/axios',
		'cookie-universal-nuxt'
		// '@nuxtjs/auth'
	],
	/*
  ** Axios module configuration
  */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},

	serverMiddleware: ['~/api/index.js'],

	/*
  ** Build configuration
  */
	build: {
		/*
    ** You can extend webpack config here
    */
		extend(config, ctx) {} // eslint-disable-line no-unused-vars
	}
};
