module.exports = {
  entry: '<%= entry %>',
  output: {
    filename: 'module.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /src\/.*\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: <%- JSON.stringify(babelPresets) %>
            }
          }
        ]
      }
    ]
  },
  externals: [
    'react', 'react-dom', 'dicoogle-client', 'dicoole-webcore', 'reflux', 'react-bootstrap',
    'react-bootstrap-table', 'react-imageloader', 'react-router', 'react-router-bootstrap'
  ]
};
