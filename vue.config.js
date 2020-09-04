module.exports = {
  productionSourceMap: false,
  outputDir: 'firebase/dist',
  pwa: {
    name: 'Dragonfly',
    themeColor: '#000',
    manifestOptions: {
      description:
        'Application that helps teachers to manage tasks and monitor student performance in university',
      orientation: 'portrait',
      background_color: '#fff'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/settings";
          @import "bootstrap/scss/_functions";
          @import "bootstrap/scss/_variables";
          @import "bootstrap/scss/_mixins";
        `
      }
    }
  }
}
