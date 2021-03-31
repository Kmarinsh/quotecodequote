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
    "if ifelse ifelse else",
    `if 2 < 3 output 3 end elif x>5 output 2 end elif x<8 output 8 end else output 1 end `,
  ],

  ["for loops", `loop x from 1 to 20 by 2 output x end `],

  ["for loops", `loop x from 20 to 1 by -2 output x end `],

  ["while loops", `loop until i==100 i is i+1 output i end`],

  ["variable declarations", "x is 3"],
  
  ["variable declarations", `
  y is 2
  x is y+3`
  ],

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

  ["class declaration", `
    class Dog
      bark is 
        output "bark"
      end
    end
    `],

  ["class declarations with paramaters", `
    class Point has x and y 
      sum is 
        out x+y
      end
        
      distance of a and b is
        out (x-a)*(y-b) 
      end
    end
    `],
    
  ["class calls", `
    class Point has x and y 
      sum is 
        out x+y
      end
        
      distance of a and b is
        out (x-a)*(y-b) 
      end
    end
    p is new Point with x as 3 and y as 2
    `],

  ["class fields call",`
  class Point has x and y 
	  
  sum is
  	  out x+y
    end
    
    distance of a and b is
  	  out (x-a)*(y-b) 
    end
  end
  
  p is new Point with x as 3 and y as 2
  output p:x
  `
  ],

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
f is p:distance with a as 3 and b as 4`]
  
];

// // Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  // ["Semantically incorrect for loop", `loop x from 'yes' to 'no' by 'idk' end` , /Initial value must be a number/],
  ["improper function calls", `
    function average of x and y is
      sum is x+y
      out sum/2
    end
    avg is call average with yasd as 2 and xasdasd as 4`, /Arguments of calls must match that of the callee/],
  ["improper number of arguments", `
    function average of x and y is
      sum is x+y
      out sum/2
    end
    avg is call average with x as 2`, /Calls must have the same number of parameters as the callee/],
  ["improper order of arguments", `
    function average of x and y is
      sum is x+y
      out sum/2
    end
    avg is call average with y as 2 and x as 3`, /Arguments of calls must match that of the callee/],
   [" improper class calls", `
   class Point has x and y 
      sum is 
          out x+y
        end 
        distance of a and b is
          out (x-a)*(y-b) 
        end
    end
        
    p is new Point with ajksd as 3 and ioupo as 2
    `, /Arguments of calls must match that of the callee/],
    ["improper method calls", `
        class Point has x and y 
          sum is 
            out x+y
          end
            
          distance of a and b is
            out (x-a)*(y-b) 
          end
        end
    
        p is new Point with x as 4 and y as 53
        f is p:distance with x as 3 and b as 4
      `, /Arguments of calls must match that of the callee/],
    ["improper class calls", `
      class Point has x and y 
        sum is 
          out x+y
        end
          
        distance of a and b is
          out (x-a)*(y-b) 
        end
      end
      p is new Apple with x as 3 and y as 2
      `, /Class has not been declared/],
      
      
]


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
});