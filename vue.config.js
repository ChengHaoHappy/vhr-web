//配置代理
let proxyObj = {};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true, //是否跨越
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj,
        https:false,
        hotOnly:false,
    },
    configureWebpack: {
        devtool: 'source-map',
    }
}