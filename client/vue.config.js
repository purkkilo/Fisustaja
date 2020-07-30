module.exports = {
  "outputDir": "J:\\Fisustaja\\JSVersion\\FisuJS\\server\\public",
  "devServer": {
    "proxy": {
      "^/api": {
        "target": "http://localhost:5000",
        "ws": true,
        "changeOrigin": true
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}