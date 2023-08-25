import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup";

const production = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/spark.ts",
    output: [
      {
        file: "dist/spark.js",
        format: "umd",
        name: "spark",
        sourcemap: production ? false : "inline",
      }
    ],
    plugins: [
      typescript(),
      nodeResolve(),
      commonjs(),
      babel({ babelHelpers: "bundled" }),
      json(),
      production && cleanup(),
      // production && terser(),
    ],
  },
];
