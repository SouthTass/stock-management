module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        // target: 'http://219.143.134.188:3000',
        target: 'http://localhost:3000',
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
