module.exports = {
  siteName: 'TCG',
  plugins: [
    {
      use: 'gridsome-plugin-pwa',
      options: {
          title: 'TCG',
          startUrl: '/',
          display: 'standalone',
          statusBarStyle: 'default',
          manifestPath: 'manifest.json',
          serviceWorkerPath: 'service-worker.js',
          shortName: 'Gridsome',
          themeColor: '#cb2d3e',
          backgroundColor: '#232323',
          icon: 'src/favicon.png'
      }
    }
  ]
}
