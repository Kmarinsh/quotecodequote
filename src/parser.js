let fs = require("fs");

import ohm from "ohm-js";
import * as ast from "./ast.js";

const qcqGrammar = ohm.grammar(
  fs.readFileSync("../quotecodequote/Grammar/quotecodequote.ohm")
);

export default function parse(sourceCode) {
  const match = aelGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
