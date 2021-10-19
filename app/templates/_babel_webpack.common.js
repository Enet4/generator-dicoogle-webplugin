module.exports = {
  entry: '<%= entry %>',
  output: {
    filename: 'module.js',
    path: __dirname,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
    'react', 'react-dom', 'dicoogle-client', 'dicoogle-webcore', 'reflux', 'react-bootstrap',
    'react-bootstrap-table', 'react-imageloader', 'react-router', 'react-router-bootstrap'
  ]
};
