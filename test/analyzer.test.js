//
import assert from "assert";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as ast from "../src/ast.js";

// // Programs that are semantically correct
const semanticChecks = [
  ["print statements", `output "hello world"`],
  ["basic if statments", `if 2 < 3 output 3 end `],
  ["if else statments", `if 2 < 3 output 3 end else output 4 end `],
  [
    "if ifelse else",
    `if 2 < 3 output 3 end elif x>5 output 2 end else output 1 end `,
  ],
  [
    "if ifelse else",
    `if 2 < 3 output 3 end elif x>5 output 2 end else output 1 end `,
  ],
  ["for loops", `loop x from 1 to 20 by 2 output x end `],
  ["while loops", `loop until i==100 i is i+1 output i end`],
  //["basic functions", "function f of x and y and z is print x+y+z end"]
  ["variable declarations", "x is 3"],
  ["variable declarations", "x is y+3"],
  ["function declarations", `
    function hello is
        output "hello"
      end`],
  ["function declarations with paramaters", `
    function average of x and y is
	    sum is x+y
	    out sum/2
    end`],
  ["function calls", `
  function average of x and y is
    sum is x+y
    out sum/2
  end
  avg is call average with x as 2 and y as 4`],
  // ["function calls with parametes", ``]
  ["SHOULD NOT WORK", `
  function average of x and y is
    sum is x+y
    out sum/2
  end
  avg is call average with yasd as 2 and xasdasd as 4`],

];

// // Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  // ["Semantically incorrect for loop", `loop x from 'yes' to 'no' by 'idk' end` , /Initial value must be a number/],
  ["improper function calls", `
  function average of x and y is
    sum is x+y
    out sum/2
  end
  avg is call average with yasd as 2 and xasdasd as 4`, /Arguments of function call must match that of the function/],
];


describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)));
    });
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern);
    });
  }
  //   for (const [scenario, source, graph] of graphChecks) {
  //     it(`properly rewrites the AST for ${scenario}`, () => {
  //       assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
  //     })
  //   }
});
