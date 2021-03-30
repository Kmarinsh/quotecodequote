//
import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// // Programs that are semantically correct
const semanticChecks = [
  ["print statements", `output "hello world"`],
  ["basic if statments", `if 2 < 3 output 3 end `],
  ["if else statments", `if 2 < 3 output 3 end else output 4 end `],
  ["if ifelse else", `if 2 < 3 output 3 end elif x>5 output 2 end else output 1 end `],
  ["if ifelse else", `if 2 < 3 output 3 end elif x>5 output 2 end else output 1 end `],
  ["for loops", `loop x from 1 to 20 by 2 output x end `],
  //["basic functions", "function f of x and y and z is print x+y+z end"]
  ["variable declarations", 'x is 3']
]

// // Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  // ["Semantically incorrect for loop", `loop x from 'yes' to 'no' by 'idk' end` , /Initial value must be a number/],
]

// // Test cases for expected semantic graphs after processing the AST. In general
// // this suite of cases should have a test for each kind of node, including
// // nodes that get rewritten as well as those that are just "passed through"
// // by the analyzer. For now, we're just testing the various rewrites only.

// // const Int = ast.Type.INT
// // const Void = ast.Type.VOID
// // const intToVoidType = new ast.FunctionType([Int], Void)

// // const varX = Object.assign(new ast.Variable("x", false), { type: Int })

// // const letX1 = Object.assign(new ast.VariableDeclaration("x", false, 1n), {
// //   variable: varX,
// // })
// // const assignX2 = new ast.Assignment(varX, 2n)

// // const funDeclF = Object.assign(
// //   new ast.FunctionDeclaration("f", [new ast.Parameter("x", Int)], Void, []),
// //   {
// //     function: Object.assign(new ast.Function("f"), {
// //       type: intToVoidType,
// //     }),
// //   }
// // )

// // const structS = new ast.StructDeclaration("S", [new ast.Field("x", Int)])


describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
//   for (const [scenario, source, graph] of graphChecks) {
//     it(`properly rewrites the AST for ${scenario}`, () => {
//       assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
//     })
//   }
})