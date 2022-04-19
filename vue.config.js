module.exports = {
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
    },
    filenameHashing: false,
    pages: {
        build: {
            entry: 'src/main.js',
            filename: 'index.html'
        }
    },

}