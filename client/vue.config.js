const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    headers: { "Access-Control-Allow-Origin": "*" },
    devServer: {
        proxy: {
            headers: { "Access-Control-Allow-Origin": "*" },
            '^/api': {
                target: "http://localhost:5000",
                ws: true,
                changeOrigin: true
            }
        }
    }
}