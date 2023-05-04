import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
  // CommonJS bundle
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
    },
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      commonjs(),
      resolve({ preferBuiltins: true }),
      json(),
    ],
  },
  // ES Modules bundle
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm",
      format: "esm",
    },
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      commonjs(),
      resolve({ preferBuiltins: true }),
      json(),
    ],
  },
  // Minified bundle
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.min.js",
      format: "iife",
      name: "llm.ts",
    },
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      commonjs(),
      resolve({ preferBuiltins: true }),
      terser(),
      json(),
    ],
  },
];
