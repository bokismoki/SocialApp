module.exports = function () {
    const tailwindConfig = require('@nuxtjs/tailwindcss')
    this.options.env.tailwind = tailwindConfig
}