require('dotenv').config()

const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all')
const path = require('path')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:/]+/g) || []
  }
}

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Social App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Social App - share your thoughts and chat with friends' },
      { name: 'google-site-verification', content: '73HQE2kBuCnwh9759U9zhviRTReXw2MKNrGVpV-lTGA' },
      { hid: 'og:title', name: 'og:title', content: 'Social App' },
      { hid: 'og:locale', name: 'og:locale', content: 'en_EU' },
      { hid: 'og:url', name: 'og:url', content: process.env.BASE_URL || 'http://localhost:3000' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:image', name: 'og:image', content: 'https://cdn.pixabay.com/photo/2018/11/29/21/51/social-media-3846597_960_720.png' },
      { hid: 'og:description', name: 'og:description', content: 'Social App - share your thoughts and chat with friends' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-social-sharing'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '~modules/import-tailwind-config',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  auth: {
    strategies: {
      facebook: {
        client_id: process.env.FACEBOOK_APP_ID,
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
        scope: ['public_profile', 'email']
      },
      google: {
        client_id: process.env.GOOGLE_APP_ID
      }
    },
    plugins: [
      '~/plugins/axios.js'
    ]
  },
  axios: {
    baseURL: 'https://social-app-social.herokuapp.com/api'
  },
  /*
  ** Build configuration
  */
  router: {
    middleware: ['closeDropdownMenu']
  },
  build: {
    extractCSS: true,
    extend(config, ctx) {
      config.plugins.push(
        new PurgecssPlugin({
          whitelist: ['html', 'body'],
          paths: glob.sync([
            path.join(__dirname, 'components/**/*.vue'),
            path.join(__dirname, 'layouts/**/*.vue'),
            path.join(__dirname, 'pages/**/*.vue')
          ]),
          extractors: [{
            extractor: TailwindExtractor,
            extensions: ['html', 'js', 'vue']
          }]
        })
      )
    }
  },
}
