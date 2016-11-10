module.exports = {
    entry: './app/index.ts',
    output: {
        filename: 'webgl-chess.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.html$/, loader: "html" }
        ]
    },
    plugins: []
};