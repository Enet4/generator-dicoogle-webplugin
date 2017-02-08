module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'module.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /src\/.*\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["es2015"]
            }
          }
        ]
      }
    ]
  },
  externals: ['react', 'react-dom', 'dicoogle-client', 'dicoole-webcore', 'reflux', 'react-bootstrap', 'react-bootstrap-table', 'react-imageloader', 'react-router', 'react-router-bootstrap']
};
