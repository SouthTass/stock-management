module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api/': {
        target: 'http://47.93.185.110:7000',
        changeOrigin: true,
      }
    } 
  },
  chainWebpack: function(config) {
    config.externals({
      "axios": "axios",
      "jquery": "$"
    });
  },
}
