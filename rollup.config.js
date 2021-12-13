import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';
import path from 'path';

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'public',
  },
  preserveEntrySignatures: false,

  plugins: [
    copy({
      targets: [
        { src: 'manifest.webmanifest', dest: './public' },
        { src: 'icons/*.png', dest: './public' },
        { src: '*.svg', dest: './public' },
        { src: '*.ico', dest: './public' },
      ],
    }),
    /** Enable using HTML as rollup entrypoint */
    html({
      transformHtml: [
        html2 =>
          html2.replace(
            '</head>',
            `<meta name="theme-color" content="#344675" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="#344675" />
            <meta name="apple-mobile-web-app-title" content="RbbCleaning" />
            <link rel="shortcut icon" href="favicon.ico" />
            <link rel="icon" href="favicon.svg" />
            <link rel="apple-touch-icon" href="apple-touch-icon.png" />
            <link rel="manifest" href="./manifest.webmanifest" />
            </head>`
          ),
      ],
      minify: true,
      injectServiceWorker: true,
      serviceWorkerPath: 'public/sw.js',
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: ['last 3 Chrome major versions'],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    /** Create and inject a service worker */
    generateSW({
      globIgnores: ['polyfills/*.js', 'nomodule-*.js'],
      navigateFallback: '/index.html',
      // where to output the generated sw
      swDest: path.join('public', 'sw.js'),
      // directory to match patterns against to be precached
      globDirectory: path.join('public'),
      // cache any html js and css by default
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    }),
  ],
};
