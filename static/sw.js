/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/css/0.styles.0e018a5f.css",
    "revision": "84285e3c699dfe69fd58eb0d0bf3a703"
  },
  {
    "url": "assets/js/app.6bdf71cc.js",
    "revision": "9936e750420490d535d29c5707d3d719"
  },
  {
    "url": "assets/js/component--404.5364e087.js",
    "revision": "bb9aeddd24c0b76d7601c8c0e96294ec"
  },
  {
    "url": "assets/js/component--home.41ebb070.js",
    "revision": "815b67bd15050689bb5ef2e342fca46c"
  },
  {
    "url": "assets/js/page-query.010332ed.js",
    "revision": "aac1496a4cdf0edcd493f1715f79451d"
  },
  {
    "url": "assets/js/vendors~component--home.95275502.js",
    "revision": "2e08ba8989813b2422c2220d0b1f903c"
  },
  {
    "url": "assets/manifest/client.json",
    "revision": "41fea91ed09938db6934420240912957"
  },
  {
    "url": "assets/manifest/server.json",
    "revision": "949ae9483f1fa7feccedd473df3d9c83"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
