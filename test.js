let fs = require("fs");
let ohm = require("ohm-js");
let assert = require("assert");

let contents = fs.readFileSync(__dirname + "/Grammar/quotecodequote.ohm");
let codequotecode = ohm.grammar(contents);

describe("assignment", () => {
  it("lets us assign an id to a number", () => {
    results = codequotecode.match("x is 3");
    assert(results.succeeded());
  });
  it("lets us assign an id to an expression", () => {
    results = codequotecode.match("x is (y + 9)");
    assert(results.succeeded());
  });
  it("does not let us assign a number to a keyword", () => {
    results = codequotecode.match("5 is x");
    assert(results.succeeded() === false);
  });
  it("does not let us assign an id to a statement", () => {
    results = codequotecode.match("x is y is 2");
    assert(results.succeeded() === false);
  });
});

describe("functions", () => {
  it("lets us declare a simple function", () => {
    results = codequotecode.match(
      "function sum in: x,y \n\t sum is x + y \n out: sum/2"
    );
    assert(results.succeeded());
  });
  it("lets us call a function", () => {
    results = codequotecode.match("sum(1,2)");
    assert(results.succeeded());
  });
  it("lets us declare a function without parameters", () => {
    results = codequotecode.match("function");
    assert(results.succeeded() === false);
  });
});

describe("conditionals and loops", () => {
  it("lets us write a conditional statement", () => {
    results = codequotecode.match(
      "if x == 0 \n\t output y \n ⇦ else if x == 1 \n\t output z \n ⇦else \n\t output z+3"
    );
    assert(results.succeeded());
  });
});

describe("strings", () => {
  it("lets us create a string variable", () => {
    results = codequotecode.match('x is "hello, world!"');
    assert(results.succeeded());
  });
  it("does not let us create a string variable with single quotes", () => {
    results = codequotecode.match("y is 'hello, world!'");
    assert(results.succeeded() === false);
  });
});

describe("lists and maps", () => {
  it("lets us create a dictionary variable", () => {
    results = codequotecode.match("x is map[[a: 1], [b: 2]]");
    assert(results.succeeded());
  });
  it("does not let us use a statement as dictionary value", () => {
    results = codequotecode.match("y is map[ [x: 2], [y:3 = 5] ]");
    assert(results.succeeded() === false);
  });
  it("lets us create a list variable", () => {
    results = codequotecode.match("x is list[1, 2]");
    assert(results.succeeded());
  });
  it("does not let us have a statement in list", () => {
    results = codequotecode.match("x is list[x+3]");
    assert(results.succeeded() === false);
  });
});
