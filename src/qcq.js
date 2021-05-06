#! /usr/bin/env node

import fs from "fs/promises"
import process from "process"
import analyze from "./analyzer.js"
import compile from "./compiler.js"
import generate from "./generator.js"
import optimize from "./optimizer.js"

const help = `qcq compiler
Syntax: src/qcq.js <filename> <outputType>
Prints to stdout according to <outputType>, which must be one of:
  ast        the abstract syntax tree
  analyzed   the semantically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
  generated  the generated js representation
`



async function compileFromFile(filename, outputType) {
  if(filename.includes("python")){
    throw new Error("WE ARE NOT PYTHON!")
  }
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