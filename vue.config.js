const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  "lintOnSave": process.env.NODE_ENV !== 'production' ? 'warning' : 'default',
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  }
}