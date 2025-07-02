const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const postcss = require('rollup-plugin-postcss');

module.exports = [
  // 主要的 JavaScript 构建
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src'
      })
    ]
  },
  // CSS 样式构建
  {
    input: 'src/styles.css',
    output: {
      file: 'dist/ew-vue-component.css'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        config: {
          path: './postcss.config.js'
        }
      })
    ]
  }
];