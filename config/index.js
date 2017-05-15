// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

// get production environment
var buildEnvArg = process.argv.find((arg) => arg.indexOf('--env') >= 0);
var buildEnv = buildEnvArg ? buildEnvArg.split('=')[1] : '';
var SITE = {
  'www': 'fxiaoke.com',
  'ceshi112': 'ceshi112.com',
  'ceshi113': 'ceshi113.com'
}
var BUILD = 'dist';
var APP = 'email-questionnaire';
var assetsPublicPath = '';
if(buildEnv === 'www'){
  assetsPublicPath = `//www.${SITE[buildEnv]}/open/fe-pay/${APP}/${BUILD}/`
}else{
  assetsPublicPath = `//${buildEnv}.fspage.com/h5/${APP}/${BUILD}/`
}

module.exports = {
  base: {
    buildEnv: buildEnv
  },
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: assetsPublicPath,
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/open/emailproxy': {
        target: 'http://10.113.32.48:8004',
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
