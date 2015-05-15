var webpack = require('webpack');
module.exports = {
    entry: {
        homePage: './Scripts/App/UI/HomePage.ts',
        favoritesPage: './Scripts/App/UI/FavoritesPage.ts',
        routesPage: './Scripts/App/UI/RoutesPage.ts',
        trainPage: './Scripts/App/UI/TrainPage.ts'
    },
    output: {
        path: __dirname + '/Content/dist/scripts/',
        filename: '[name].entry.js',
        publicPath: 'Content/dist'
    },
    externals: {
        "jquery": "$",
        "Q": true
    },
    plugins: [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ]),
        new webpack.ProvidePlugin({
            $: "jquery"
        })
    ],
    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['./bower_components']
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
