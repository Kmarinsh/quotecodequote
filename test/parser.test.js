import assert from "assert";
import { endianness } from "os";
import util from "util";
import parse from "../src/parser.js";

const source = [
  `
  function factorial of x is
    if x == 0 or x == 1
      out x
    end
    else
      out x * call factoral x-1
    end
  end
  `,

  `function average of x and y is
	  sum is x+y
	  out sum/2
   end`,

  `
  function largestNum of x and y and z is
      if x >= y and x >= z
          out x
      end
      elif y >= x and y >= z
          out y
      end
      else
          out z
      end
  end
  `,

  `
  output "hello, world"
  `,

  `
  loop i from 0 to 10 by 1
    call x with a as 1 and b as 3
  end
  `,

  `
  call x
  `,

  `1 or 2`,

  `x is 3`,

  `
   if gaming
    output gfuel
   end
   else
    x is 3
   end
   `,

  `
   x and y
   `,

  `
   x is 0
   loop until x == 5
    x is x+1
   end
   `,

  `
    function noArg is
      outs 5
    end
   `,

  `
   function hi of x and y is
      if x < y
        out "x is less"
      end
      elif y > x
        out "y is less"
      end
      else
        out "equal"
      end
    end
   `,

  `
      if 5 < 3
        out x
      end
      elif 3 > 4
        out y
      end
   `,
  `
   output x > y and x < z
 `,

  `
  loop i from 0 to 100 by 5 end
  `,
  `
  loop until x>=10 or x<=10 or x==10 or x!=10 or x<10 or x>10
	  output x
  end
  `,
  `
  class Point has x and y 
	sum is 
    	out x+y
    end
    
    distance of a and b is
    	out (x-a)*(y-b) 
    end
end
`,
  `
  new Point with x as 3 and y as 2
  `,
  `
  p is new Point with x as 23 and y as 3
  `,
  `
  a is p:x with y as 2 and z as 3
  `,
  `
  p:x is 2
  `,
  `
  class Point has x and y end
  `,
];

const badSource = [`if x`, `loop`];

const expectedAst3 = String.raw`   1 | Program blocks=[#2]
   2 | Block statements=#3
   3 | Function id=#4 params=[#5] block=[#7]
   4 | IdentifierExpression id='factorial'
   5 | Params factors=[#6]
   6 | IdentifierExpression id='x'
   7 | Block statements=#8
   8 | If condition=#9 block=[#16] elifstatement=[] elsestatement=[#19]
   9 | BinaryExp op='or' left=#10 right=#13
  10 | BinaryExp op='==' left=#11 right=#12
  11 | IdentifierExpression id='x'
  12 | IdentifierExpression id='0'
  13 | BinaryExp op='==' left=#14 right=#15
  14 | IdentifierExpression id='x'
  15 | IdentifierExpression id='1'
  16 | Block statements=#17
  17 | Return value=[#18]
  18 | IdentifierExpression id='x'
  19 | Else block=#20
  20 | Object block=[#21,#27]
  21 | Block statements=#22
  22 | Return value=[#23]
  23 | BinaryExp op='*' left=#24 right=#25
  24 | IdentifierExpression id='x'
  25 | FuncCall id=#26 args=[]
  26 | IdentifierExpression id='factoral'
  27 | Block statements=#28
  28 | BinaryExp op='-' left=#29 right=#30
  29 | IdentifierExpression id='x'
  30 | IdentifierExpression id='1'`;

describe("The parser", () => {
  for (let program of source) {
    it("can parse all the nodes", (done) => {
      assert.ok(parse(program));
      done();
    });
  }

  for (let program of badSource) {
    it("rejects", (done) => {
      assert.throws(() => parse(program));
      done();
    });
  }
});

describe("Direct checking Factorial AST", () => {
  it("checked directly against ast", (done) => {
    assert.equal(util.format(parse(source[0])).trim(), expectedAst3.trim());
    done();
  });
});
