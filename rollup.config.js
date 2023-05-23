import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    json(),
    typescript({
      tsconfigOverride: { compilerOptions: { module: 'ESNext' } }
    }),
    commonjs(),
    resolve()
  ]
}
