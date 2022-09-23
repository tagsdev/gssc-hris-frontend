module.exports = {
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: true
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: '@import "src/styles/quasar.variables.scss";'
            }
        }
    },
    filenameHashing: true,
    transpileDependencies: [
        'quasar'
    ]
}
