import assert from "assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
    {
        name: "Hello World",
        source: `output "hello, world!"`,
        expected: `console.log("hello, world!")`,
    },
    {
        name: "basic if statements",
        source: `
        if 2 < 3 
          output 5 
        end`,
        expected: dedent`
        if (((2) < (3))) {
        console.log(5)
        }`
    },
    {
        name:"if ifelse else",
        source: `
        if 2 < 3 
          output 3 
        end
        elif x>5 
          output 2 
        end 
        else 
          output 1 
        end `,
        expected: dedent`
        if (((2) < (3))) {
        console.log(3)
        }
        else if (((x) > (5))) {
        console.log(2)
        }
        else {
        console.log(1)
      }`
    },
    {
        name:"if ifelse ifelse else",
        source: `
        if 2 < 3 
          output 3 
        end 
        elif x>5 
          output 2 
        end 
        elif x<8 
          output 8 
        end 
        else 
          output 1 
        end `,
        expected: dedent`
        if (((2) < (3))) {
        console.log(3)
        }
        else if (((x) > (5))) {
        console.log(2)
        }
        else if (((x) < (8))) {
        console.log(8)
        }
        else {
        console.log(1)
        }`
    },
    {
      name:"for loops 1",
      source: `
      loop x from 1 to 20 by 2 output x end `,
      expected: dedent`
      for (let x = 1; x <= 20; x = x + 2) {
      console.log(x)
      }`
    },
    {
      name:"foor loops 2",
      source: `
      loop x from 20 to 1 by -2 output x end `,
      expected: dedent`
      for (let x = 20; x >= 1; x = x + -2) {
      console.log(x)
    }`
    },
    {
      name:"while loops",
      source: `
      loop until i==100 i is i+1 output i end`,
      expected: dedent`
      while (!(((i) === (100)))) {
        let i = ((i) + (1))
        console.log(i)
      }`
    },
    {
      name:"variable declarations 1",
      source: `x is 3`,
      expected: dedent`
      let x = 3`
    },
    {
      name:"variable declarations 2",
      source: `y is 2 x is y+3`,
      expected: dedent`
      let y = 2
      let x = ((y) + (3))`
    },
    {
      name:"function declarations",
      source: `
      function hello is 
        output "hello"
      end`,
      expected: dedent`
      function hello() {
        console.log("hello")
      }`
    },
    {
      name:"function declarations with parameters",
      source: `
      function average of x and y is
        sum is x+y
        out sum/2
      end`,
      expected: dedent`
      function average(x, y) {
        let sum = ((x) + (y))
        return ((sum) / (2))
      }`
    },
    {
      name:"function calls",
      source: `
      function average of x and y is
        sum is x+y
        out sum/2
      end
      avg is call average with x as 2 and y as 4`,
      expected: dedent`
      function average(x, y) {
        let sum = ((x) + (y))
        return ((sum) / (2))
      }
      let avg = average(2, 4)`
    },
    {
      name:"class declarations",
      source: `
      class Dog
        bark is 
          output "bark"
        end
      end`,
      expected: dedent`
      class Dog {
        constructor() {
        }
        bark() {
          console.log("bark")
        }
      }`
    },
    {
      name:"class declarations with parameters",
      source: `
      class Point has x and y 
        sum is 
          out x+y
        end
        distance of a and b is
          out (x-a)*(y-b) 
        end
      end`,
      expected: dedent`
      class Point {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
        get_x() { return this.x }
        get_y() { return this.y }
        sum() {
          return ((x) + (y))
        }
        distance(a, b) {
          return ((x-a) * (y-b))
        }
      }`
    },
    {
      name:"class calls",
      source: `
      class Point has x and y 
        sum is 
          out x+y
        end  
        distance of a and b is
          out (x-a)*(y-b) 
        end
      end
      p is new Point with x as 3 and y as 2`,
      expected: dedent`
      class Point {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
        get_x() { return this.x }
        get_y() { return this.y }
        sum() {
          return ((x) + (y))
        }
        distance(a, b) {
          return ((x-a) * (y-b))
        }
      }
      let p = new Point(3, 2)`
    },
    {
      name:"class fields calls",
      source: `
      class Point has x and y 
        sum is
          out x+y
        end
        distance of a and b is
          out (x-a)*(y-b) 
        end
      end
      p is new Point with x as 3 and y as 2
      output p:x`,
      expected: dedent`
      class Point {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
        get_x() { return this.x }
        get_y() { return this.y }
        sum() {
          return ((x) + (y))
        }
        distance(a, b) {
          return ((x-a) * (y-b))
        }
      }
      let p = new Point(3, 2)
      console.log(p.get_x())`
    },
    {
      name:"method calls",
      source: `
      class Point has x and y 
	      sum is 
  	      out x+y
        end
        distance of a and b is
  	      out (x-a)*(y-b) 
        end
      end
      p is new Point with x as 4 and y as 53
      f is p:distance with a as 3 and b as 4`,
      expected: dedent`
      class Point {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
        get_x() { return this.x }
        get_y() { return this.y }
        sum() {
          return ((x) + (y))
        }
        distance(a, b) {
          return ((x-a) * (y-b))
        }
      }
      let p = new Point(4, 53)
      let f = p.distance(3, 4)`
    },
    {
      name:"class fields mutation",
      source: `
      class Point has x and y 
	      sum is 
  	      out x+y
        end
    
        distance of a and b is
  	      out (x-a)*(y-b) 
        end
      end
      p is new Point with x as 3 and y as 2
      p:x is 5
      output p:x`,
      expected: dedent`
      class Point {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
        get_x() { return this.x }
        get_y() { return this.y }
        sum() {
          return ((x) + (y))
        }
        distance(a, b) {
          return ((x-a) * (y-b))
        }
      }
      let p = new Point(3, 2)
      p.x = 5
      console.log(p.get_x())`
    },

    // {
    //   name:"optimized function declarations",
    //   source: `
    //   function hello is 
    //     out "hello"
    //     out "goodbye"
    //   end`,
    //   expected: dedent`
    //   function hello() {
    //     return "hello"
    //   }`
    // },
    





    /*

  ["class fields mutation",`
  class Point has x and y 
	  sum is 
  	  out x+y
    end
    
    distance of a and b is
  	  out (x-a)*(y-b) 
    end
  end
  
  p is new Point with x as 3 and y as 2
  p:x is 5
  `
  ],


  ["method calls", `
class Point has x and y 
	sum is 
  	out x+y
  end
    
  distance of a and b is
  	out (x-a)*(y-b) 
  end
end

p is new Point with x as 4 and y as 53
f is p:distance with a as 3 and b as 4`],

  
];

    */

]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})