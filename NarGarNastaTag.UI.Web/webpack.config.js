module.exports = {

    entry: './Scripts/App/UI/Loader.ts',
    output: {
        path: __dirname + '/Content/dist/scripts/',
        filename: 'bundle.js',
        chunkFilename: '[id].js',
        publicPath: 'Content/dist'
    },
    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['./Scripts/vendor'],
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    // Add loader for .ts files.
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'typescript-loader'
        }]
    }
};
