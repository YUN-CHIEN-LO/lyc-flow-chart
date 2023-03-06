
const { defineConfig } = require('@vue/cli-service')
// 生產環境旗標
const isProduction = ["production"].includes(process.env.NODE_ENV);

module.exports = defineConfig({
  // 轉譯第三方依賴
  transpileDependencies: true,
  // 全局 scss
  css: {
    // 是否將 components 中的 css 提取至獨立的 CSS 文件
    // (非動態注入到 JavaScript inline 代碼中)
    extract: isProduction,
    // 是否產出 CSS Source Map
    sourceMap: !isProduction,
    loaderOptions: {
      // 全局引入
      scss: {
        additionalData: `@import "@/styles/index.scss";`,
      },
    },
  },
})
