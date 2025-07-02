module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        minifyFontValues: true,
        minifyParams: true,
        colormin: true,
        convertValues: true,
        reduceIdents: false, // 保持动画名称不变
      }]
    })
  ]
}; 