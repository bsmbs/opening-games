module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:8400',
                ws: true,
                changeOrigin: true,
                secure: false,
                logLevel: 'error'
            }
        }
    }
}