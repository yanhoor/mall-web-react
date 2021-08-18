const { override, addWebpackAlias, addLessLoader } = require('customize-cra')
const path = require('path')

module.exports = override(
    addWebpackAlias({
        "@": path.resolve(__dirname, "src")
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            "@brand-primary": '#64BFBB',
            '@primary-color': '#1DA57A'
        }
    }),
)
