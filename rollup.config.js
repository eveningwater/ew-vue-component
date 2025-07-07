const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const { writeFileSync } = require('fs');

const banner = `/**
 * ew-vue-component - Vue 3 动态组件库
 * (c) ${new Date().getFullYear()} eveningwater
 * Released under the MIT License.
 */`;

function createEntryFiles() {
  // CJS 入口
  writeFileSync(
    'dist/index.js',
    `// Auto-generated CJS entry\n'use strict';\nif (process.env.NODE_ENV === 'production') {\n  module.exports = require('./ew-vue-component.cjs.prod.js');\n} else {\n  module.exports = require('./ew-vue-component.cjs.js');\n}\n`
  );
  // ESM 入口（Node 20+ 支持条件导出，打包器 alias 更推荐）
  writeFileSync(
    'dist/index.mjs',
    `// Auto-generated ESM entry\nexport * from process.env.NODE_ENV === 'production' ? './ew-vue-component.esm.prod.js' : './ew-vue-component.esm.js';\n`
  );
}

module.exports = [
  // CJS 生产
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.cjs.prod.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: false, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: true, 
        declarationDir: 'dist', 
        rootDir: 'src',
        declarationMap: true
      })
    ]
  },
  // CJS 开发
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: true, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      })
    ]
  },
  // ESM 生产
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.esm.prod.js',
      format: 'es',
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: false, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      })
    ]
  },
  // ESM 开发
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.esm.js',
      format: 'es',
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: true, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      })
    ]
  },
  // 浏览器全局开发
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.global.js',
      format: 'iife',
      name: 'EwVueComponent',
      globals: {
        vue: 'Vue'
      },
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: true, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      }),
      postcss({ extract: false })
    ]
  },
  // 浏览器全局生产
  {
    input: 'src/index.ts',
    external: ['vue'],
    output: {
      file: 'dist/ew-vue-component.global.prod.js',
      format: 'iife',
      name: 'EwVueComponent',
      globals: {
        vue: 'Vue'
      },
      sourcemap: true,
      banner
    },
    plugins: [
      json(),
      replace({ __EW_DEV__: false, preventAssignment: true }),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      }),
      postcss({ extract: false })
    ]
  },
  // CSS
  {
    input: 'src/styles.css',
    output: { file: 'dist/ew-vue-component.css' },
    plugins: [
      postcss({ extract: true, minimize: true, sourceMap: true, config: { path: './postcss.config.js' } })
    ]
  },
  // 入口文件生成
  {
    input: 'src/index.ts',
    output: { file: 'dist/temp.js' },
    plugins: [
      json(),
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false, 
        declarationMap: false,
        rootDir: 'src' 
      }),
      {
        name: 'entry-file-generator',
        buildEnd() {
          createEntryFiles();
          // 删除临时文件
          const fs = require('fs');
          const path = require('path');
          const tempFile = path.join(__dirname, 'dist', 'temp.js');
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
      }
    ]
  }
];