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

// describe("comments", () => {
//   it("lets us write nonsense in a comment", () => {
//     results = codequotecode.match("...asldweroipuqwerpou");
//     assert(results.succeeded());
//   });
//   it("does not let us write a comment in the middle of a statement", () => {
//     results = codequotecode.match("x = ...comment5;");
//     assert(results.succeeded() === false);
//   });
// });

describe("functions", () => {
  it("lets us declare a simple function", () => {
    results = codequotecode.match("function sum in: x,y");
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
    results = codequotecode.match('x is "hello, world!";');
    assert(results.succeeded());
  });
  it("does not let us create a string variable with single quotes", () => {
    results = codequotecode.match("y is 'hello, world!';");
    assert(results.succeeded() === false);
  });
});

describe("lists and maps", () => {
  it("lets us create a dictionary variable", () => {
    results = codequotecode.match("x is map[[a: 1], [b: 2]];");
    assert(results.succeeded());
  });
  it("does not let us use a statement as dictionary value", () => {
    results = codequotecode.match("y is map[ [x: 2], [y:3 = 5] ]");
    assert(results.succeeded() === false);
  });
  it("lets us create a list variable", () => {
    results = codequotecode.match("x = list[1, 2]");
    assert(results.succeeded());
  });
  it("does not let us have a statement in list", () => {
    results = codequotecode.match("x is list[x+3]");
    assert(results.succeeded() === false);
  });
});

// describe("some example programs", () => {
//   it("lets you solve for pi", () => {
//     results = codequotecode.match(`RADIUS = 1;
//     PR0GRAM calculate_pi[num_darts] <
//       num_darts_in_circle = throw_darts[num_darts];
//       G1V3 (4 * (num_darts_in_circle / num_darts));
//     >

//     PR0GRAM throw_darts[num_darts] <
//       circle_count = 0;
//       C0UNT[darts_thrown:0->num_darts] <
//         PR3SUM1NG[throw_dart[] < RADIUS] <
//           circle_count = circle_count + 1;
//         >
//       >
//       G1V3 circle_count;
//     >

//     PR0GRAM throw_dart[] <
//       x = UNPR3D1CTABL3 * 2;
//       y = UNPR3D1CTABL3 * 2;
//       G1V3 calculate_distance_from_center[x, y];
//     >

//     PR0GRAM calculate_distance_from_center[x, y] <
//       G1V3 SQRT[((x - RADIUS) ** 2) + ((y - RADIUS) ** 2)];
//     >`);
//     assert(results.succeeded());
//   });
//   it("lets you do the collatz sequence", () => {
//     results = codequotecode.match(`PR0GRAM collatz_steps[n] <
//     steps = 0;
//     WH1L3[N0T (n == 1)] <
//       PR3SUM1NG[n % 2 == 0] <
//         n = n / 2;
//       > 3LS3 <
//         n = (3 * n) + 1;
//       >
//       steps = steps + 1;
//     >
//     G1V3 steps;
//   >`);
//     assert(results.succeeded());
//   });
//   it("lets you calculate powers", () => {
//     results = codequotecode.match(`PR0GRAM powers[base, limit, callback] <
//     current = 1;
//     i = 1;
//     WH1L3[current <= limit] <
//       callback[current];
//       current = base ** i;
//       i = i + 1;
//     >
//     >`);
//     assert(results.succeeded());
//   });
//   it("lets us do fizz buzz", () => {
//     results = codequotecode.match(`C0UNT[i:1->21] <
//     PR3SUM1NG[i % 15 == 0] <
//         SP3AK["FizzBuzz"];
//     > 3LS3 1F[i % 3 == 0] <
//         SP3AK["Fizz"];
//     > 3LS3 1F[i % 5 == 0] <
//         SP3AK["Buzz"];
//     > 3LS3 <
//         SP3AK[i];
//     >
//     >`);
//     assert(results.succeeded());
//   });
//   it("lets us see fibb sequence", () => {
//     results = codequotecode.match(`PR0GRAM fibb[n] <
//     PR3SUM1NG[n <= 2] <
//       G1V3 1;
//     > 3LS3 <
//       G1V3 fibb[n - 1] + fibb[n - 2];
//     >
//     >`);
//     assert(results.succeeded());
//   });
//   it("lets you calculate gcd", () => {
//     results = codequotecode.match(`PR0GRAM gcd[a, b] <
//     PR3SUM1NG[b == 0] <
//       G1V3 a;
//     >
//     G1V3 gcd[b, (a % b)];
//     >`);
//     assert(results.succeeded());
//   });
//   it("lets us calculate the area of a circle", () => {
//     results = codequotecode.match(`PR0GRAM area_of_circle[r] <
//     G1V3 3.14159265 * r * r;
//     >
//     area = area_of_circle[10];`);
//     assert(results.succeeded());
//   });
// });
