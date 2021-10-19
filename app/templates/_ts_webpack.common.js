module.exports = {
  entry: '<%= entry %>',
  output: {
    filename: 'module.js',
    path: __dirname,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
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
