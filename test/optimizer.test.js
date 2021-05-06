import assert from "assert/strict"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"

// Make some test cases easier to read
const x = new ast.Assign("x", false)

const return1p1 = new ast.Return(new ast.BinaryExp("+", 1, 1))
const return2 = new ast.Return(2)
const returnX = new ast.Return(x)
const onePlusTwo = new ast.BinaryExp("+", 1, 2)
const identity = Object.assign(new ast.Function("id"), { block: returnX })
const intFun = body => new ast.Function("f", [], body)
const callIdentity = args => new ast.FuncCall(identity, args)
const or = (...d) => d.reduce((x, y) => new ast.BinaryExp("or", x, y))
const and = (...c) => c.reduce((x, y) => new ast.BinaryExp("and", x, y))
const less = (x, y) => new ast.BinaryExp("<", x, y)
const great = (x, y) => new ast.BinaryExp(">", x, y)
const eq = (x, y) => new ast.BinaryExp("==", x, y)
const times = (x, y) => new ast.BinaryExp("*", x, y)
const print = (x) => new ast.Print(x)
const Return = (x) => new ast.Return(x)
const argums = (x) => new ast.Args(x)


const tests = [
  ["folds +", new ast.BinaryExp("+", 5, 8), 13],
  ["folds -", new ast.BinaryExp("-", 5n, 8n), -3n],
  ["folds *", new ast.BinaryExp("*", 5, 8), 40],
  ["folds /", new ast.BinaryExp("/", 5, 8), 0.625],
  ["folds ^", new ast.BinaryExp("^", 5, 8), 390625],
  ["folds <", new ast.BinaryExp("<", 5, 8), true],
  ["folds <=", new ast.BinaryExp("<=", 5, 8), true],
  ["folds ==", new ast.BinaryExp("==", 5, 8), false],
  ["folds !=", new ast.BinaryExp("!=", 5, 8), true],
  ["folds >=", new ast.BinaryExp(">=", 5, 8), false],
  ["folds >", new ast.BinaryExp(">", 5, 8), false],
  ["optimizes +0", new ast.BinaryExp("+", x, 0), x],
  ["optimizes -0", new ast.BinaryExp("-", x, 0), x],
  ["optimizes *1", new ast.BinaryExp("*", x, 1), x],
  ["optimizes /1", new ast.BinaryExp("/", x, 1), x],
  ["optimizes *0", new ast.BinaryExp("*", x, 0), 0],
  ["optimizes 0*", new ast.BinaryExp("*", 0, x), 0],
  ["optimizes 0/", new ast.BinaryExp("/", 0, x), 0],
  ["optimizes 0+", new ast.BinaryExp("+", 0, x), x],
  ["does not optimize $", new ast.BinaryExp("$", 0, 0), new ast.BinaryExp("$", 0, 0)],
  ["optimizes 1*", new ast.BinaryExp("*", 1, x), x],
  ["optimizes 1^", new ast.BinaryExp("^", 1, x), 1],
  ["optimizes ^0", new ast.BinaryExp("^", x, 0), 1],
  ["removes left false from or", or(false, less(x, 1)), less(x, 1)],
  ["removes right false from or", or(less(x, 1), false), less(x, 1)],
  ["removes right conditional from or", or(true, great(x, 1)), true],
  ["removes left conditional from or", or(less(x, 1), true), true],
  ["removes left true from and", and(true, less(x, 1)), less(x, 1)],
  ["removes right true from and", and(less(x, 1), true), less(x, 1)],
  ["removes right conditional from and", and(false, less(x, 1)), false],
  ["removes left conditional from and", and(less(x, 1), false), false],
  ["optimizes a print with binaryExpression inside", print(new ast.BinaryExp("+",1,2,)), print(3)],
  ["optimizes a return with binaryExpression inside", Return(new ast.BinaryExp("+",1,2,)), Return(3)],
  ["optimizes a class declaration", new ast.Class("Point", [], []), new ast.Class("Point", [], [])],
  ["optimizes a class declaration with fields", new ast.Class("Point", [onePlusTwo], []), new ast.Class("Point", [3], [])],
  ["optimizes a class declaration with methods", new ast.Class("Point", [], [new ast.Method("a", [new ast.Params([onePlusTwo])], [new ast.Block([return1p1, return2])])]), new ast.Class("Point", [], [new ast.Method("a", [new ast.Params([3])], [new ast.Block([return1p1])])])],
  ["optimizes in a program", new ast.Program([new ast.Block([returnX, returnX])]), new ast.Program([new ast.Block([returnX])])],
  ["optimizes a classcall with a binaryExpression inside", new ast.ClassCall("a", [new ast.BinaryExp('+', 1, 2), 2]), new ast.ClassCall("a", [3,2])],
  ["optimizes an argument with binaryExpression inside", new ast.Args('a',[new ast.BinaryExp('+', 1, 2),2]), new ast.Args('a', [3,2])],
  ["optimizes an Assign where the source value is a binaryExpression", new ast.Assign('x',new ast.BinaryExp("+",1,2)), new ast.Assign('x',3)],
  ["optimizes ClassAttr where the source value is a binaryExpression", new ast.ClassAttr('x', new ast.Method("a", [], []), [new ast.BinaryExp("+",1,2)]), new ast.ClassAttr('x', new ast.Method("a", [], []), [3])],
  ["optimizes while-false", new ast.While(false, new ast.Block()), []],
  ["optimizes while with an empty block", new ast.While(true, new ast.Block([])), new ast.While(true, new ast.Block([]))],
  ["optimizes while-true", new ast.While(new ast.BinaryExp("<", 1, 2), [new ast.Block(return1p1), new ast.Block(return2)]), new ast.While(true, [new ast.Block(return2), new ast.Block(return2)])],
  ["optimizes out of bounds for", new ast.For(x, 10, 1, 1, new ast.Block()), ""],
  ["optimizes out of bounds init < final for", new ast.For(x, 1, 10, -1, new ast.Block()), ""],
  ["optimizes for loops", new ast.For(x, 1, 10, 1, [new ast.Block(return1p1), new ast.Block(return2)]), new ast.For(x, 1, 10, 1, [new ast.Block(return2), new ast.Block(return2)])],
  ["optimizes in functions", intFun(return1p1), intFun(return2)],
  ["optimizes in functions with parameters", new ast.Function("f", [onePlusTwo, 3], [return2, return2]), new ast.Function("f", [3, 3], [return2])],
  ["optimizes in fields", new ast.Field([new ast.BinaryExp("-", 2, 2), 1]), new ast.Field([0, 1])],
  ["optimizes parameters", new ast.Params([new ast.BinaryExp("-", 2, 2), 1]), new ast.Params([0, 1])],
  ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],
  ["optimizes if conditions", new ast.If(eq(1,1), []), new ast.If(true, [])],
  ["optimizes elif conditions", new ast.Elif(eq(1,1), []), new ast.Elif(true, [])],
  ["optimizes if statements", new ast.If(eq(1,1), [return1p1]), new ast.If(true, [return2])],
  ["optimizes elif statements", new ast.Elif(eq(1,1), [return1p1]), new ast.Elif(true, [return2])],
  ["optimizes else statements", new ast.Else([return1p1]), new ast.Else([return2])],
  ["optimizes else statements without return statements", new ast.Else([new ast.Print(eq(1,1))]), new ast.Else([new ast.Print(true)])],
  ["removes code after return statements in functions", intFun([return2, return2]), intFun([return2])],
  ["removes code after return statements if statements", new ast.If(1==1, [returnX, returnX]), new ast.If(true, [returnX])],
  ["removes code after return statements in while loops", new ast.While(true, [returnX, returnX]), new ast.While(true, [returnX])],
  ["removes code after return statements everywhere", new ast.Block([returnX, returnX]), new ast.Block([returnX])],
  
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})