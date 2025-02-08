import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "./dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      typescript({ exclude: ["examples/**"] }),
      resolve(),
      terser(),
    ],
    external: ["examples"],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "./dist/index.d.ts", format: "esm" }],
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve("./src") }],
      }),
      dts(),
    ],
  },
];
