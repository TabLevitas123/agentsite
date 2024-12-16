const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "zlib": require.resolve("browserify-zlib"),
  });
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // Handle both .mjs and .js files
  config.module.rules = [
    {
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
      include: /node_modules/,
      type: "javascript/auto",
    },
    ...config.module.rules
  ];

  // Add .mjs to resolved extensions
  config.resolve.extensions = [...(config.resolve.extensions || []), '.mjs'];

  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
