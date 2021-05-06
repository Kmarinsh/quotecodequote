#! /usr/bin/env node

import fs from "fs/promises"
import process from "process"
import compile from "./compiler.js"
import generate from "./generator"

const help = `qcq compiler
Syntax: src/qcq.js <filename> <outputType>
Prints to stdout according to <outputType>, which must be one of:
  ast        the abstract syntax tree
  (WIP) analyzed   the semantically analyzed representation
  (WIP) optimized  the optimized semantically analyzed representation
  (WIP) js         the translation to JavaScript
  (WIP) generated  the generated js representation
`



async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    console.log(compile(buffer.toString(), outputType))
  } catch (e) {
    console.error(`${e}`)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}