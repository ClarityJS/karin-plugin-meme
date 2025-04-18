import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/apps/*.ts'],      // 入口文件
  format: ['esm'],       // ESM格式
  bundle: true,                 // 打包依赖
  dts: false,                    // 生成类型声明文件
  clean: true,                  // 清理dist目录
  minify: true,                 // 压缩生产环境代码
  shims: true,               // 生成polyfill代码
  target: 'node22',             // 指定ECMAScript目标版本
  sourcemap: false,              // 生成sourcemap
  treeshake: true,              // 启用树摇优化
  platform: 'node',            // 指定为Node.js环境
  splitting: true,             // 代码分割, 是否拆分文件
  outDir: 'lib',               // 指定输出目录 
  external: ['node-karin'],                 // 外部依赖, 不打包进输出文件中
})