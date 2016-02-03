module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'module.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /src\/.*\.js?$/,
        exclude: /node_modules/,
        loader: 'babel', 
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: ['react', 'react-dom', 'dicoogle-client', 'dicoole-webcore', 'reflux', 'react-bootstrap', 'react-bootstrap-table', 'react-imageloader', 'react-router', 'react-router-bootstrap']
};
