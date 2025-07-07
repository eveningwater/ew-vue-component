import example1Raw from '../template/examples/example-1.vue?raw';
import example2Raw from '../template/examples/example-2.vue?raw';
import example3Raw from '../template/examples/example-3.vue?raw';
import example4Raw from '../template/examples/example-4.vue?raw';
import example5Raw from '../template/examples/example-5.vue?raw';
import example6Raw from '../template/examples/example-6.vue?raw';
import example7Raw from '../template/examples/example-7.vue?raw';

export const examples = [
  {
    id: 'example-1',
    title: '示例1-基础组件',
    description: '基础组件使用',
    files: [
      {
        name: 'App.vue',
        content: example1Raw
      }
    ]
  },
  {
    id: 'example-2',
    title: '示例2-插件系统',
    description: '插件系统',
    files: [
      {
        name: 'App.vue',
        content: example2Raw
      }
    ]
  },
  {
    id: 'example-3',
    title: '示例3 - 异步组件渲染',
    description: '演示EwVueComponent的异步组件加载功能，包含用户资料、设置、仪表板三个完整的内联组件示例',
    files: [
      {
        name: 'App.vue',
        content: example3Raw
      }
    ]
  },
  {
    id: 'example-4',
    title: '示例4-默认样式',
    description: '展示EwVueComponent的默认样式效果，包含加载状态、错误处理、重试按钮等UI元素的现代化设计',
    files: [
      {
        name: 'App.vue',
        content: example4Raw
      }
    ]
  },
  {
    id: 'example-5',
    title: '示例5-错误处理与重试机制',
    description: '演示EwVueComponent的错误边界、自动重试功能和错误日志记录，包含同步和异步组件的错误处理场景',
    files: [
      {
        name: 'App.vue',
        content: example5Raw
      }
    ]
  },
  {
    id: 'example-6',
    title: '示例6-动态渲染组件',
    description: '动态渲染组件',
    files: [
      {
        name: 'App.vue',
        content: example6Raw
      }
    ]
  },
  {
    id: 'example-7',
    title: '示例7-动态切换不同的组件',
    description: '动态切换不同的组件',
    files: [
      {
        name: 'App.vue',
        content: example7Raw
      }
    ]
  }
];
