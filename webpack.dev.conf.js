const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    entry: './src2/index.ts',
    mode: 'development',
    target: 'node',
    output: {
      filename: 'bundle.js',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    target: 'node',
    module: {
      rules: [
          {
            test: /\.ts?$/,
            loaders: 'awesome-typescript-loader'
          },
      ]
    },
    plugins: [
      new CheckerPlugin()
    ],
    devtool: 'source-map'
  };
