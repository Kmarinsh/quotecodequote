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

const expectedAst1 = String.raw`   1 | Program names=[#2]
 2 | Block statements=#3
 3 | Function name=#4 params=[#5] block=[#7]
 4 | IdentifierExpression id='factorial'
 5 | Params params=[#6]
 6 | IdentifierExpression id='x'
 7 | Block statements=#8
 8 | If condition=#9 body=[#16] elseifstatement=[] elsestatement=[#19]
 9 | BinaryExp op='or' left=#10 right=#13
10 | BinaryExp op='==' left=#11 right=#12
11 | IdentifierExpression id='x'
12 | IdentifierExpression id='0'
13 | BinaryExp op='==' left=#14 right=#15
14 | IdentifierExpression id='x'
15 | IdentifierExpression id='1'
16 | Block statements=#17
17 | Return name=#18
18 | IdentifierExpression id='x'
19 | Else body=#20
20 | Object body=[#21,#26,#28]
21 | Block statements=#22
22 | Return name=#23
23 | BinaryExp op='*' left=#24 right=#25
24 | IdentifierExpression id='x'
25 | IdentifierExpression id='call'
26 | Block statements=#27
27 | IdentifierExpression id='factoral'
28 | Block statements=#29
29 | BinaryExp op='-' left=#30 right=#31
30 | IdentifierExpression id='x'
31 | IdentifierExpression id='1'`;

const expectedAst2 = String.raw`   1 | Program names=[#2]
   2 | Block names=#3
   3 | Function name=#4 params='of x and y and z' block=[#5]
   4 | IdentifierExpression id='largestNum'
   5 | Block names=#6
   6 | If condition=#7 body=[#32] elseifstatement=[#40] elsestatement=[#74]
   7 | Condition name=#8
   8 | BinaryExp op='and' left=#9 right=#21
   9 | Condition name=#10
  10 | Relation name=#11
  11 | BinaryExp op='>=' left=#12 right=#17
  12 | Relation name=#13
  13 | Exp name=#14
  14 | Term name=#15
  15 | Factor name=#16
  16 | IdentifierExpression id='x'
  17 | Exp name=#18
  18 | Term name=#19
  19 | Factor name=#20
  20 | IdentifierExpression id='y'
  21 | Relation name=#22
  22 | BinaryExp op='>=' left=#23 right=#28
  23 | Relation name=#24
  24 | Exp name=#25
  25 | Term name=#26
  26 | Factor name=#27
  27 | IdentifierExpression id='x'
  28 | Exp name=#29
  29 | Term name=#30
  30 | Factor name=#31
  31 | IdentifierExpression id='z'
  32 | Block names=#33
  33 | Return name=#34
  34 | Condition name=#35
  35 | Relation name=#36
  36 | Exp name=#37
  37 | Term name=#38
  38 | Factor name=#39
  39 | IdentifierExpression id='x'
  40 | Elif condition=#41 body=[#66]
  41 | Condition name=#42
  42 | BinaryExp op='and' left=#43 right=#55
  43 | Condition name=#44
  44 | Relation name=#45
  45 | BinaryExp op='>=' left=#46 right=#51
  46 | Relation name=#47
  47 | Exp name=#48
  48 | Term name=#49
  49 | Factor name=#50
  50 | IdentifierExpression id='y'
  51 | Exp name=#52
  52 | Term name=#53
  53 | Factor name=#54
  54 | IdentifierExpression id='x'
  55 | Relation name=#56
  56 | BinaryExp op='>=' left=#57 right=#62
  57 | Relation name=#58
  58 | Exp name=#59
  59 | Term name=#60
  60 | Factor name=#61
  61 | IdentifierExpression id='y'
  62 | Exp name=#63
  63 | Term name=#64
  64 | Factor name=#65
  65 | IdentifierExpression id='z'
  66 | Block names=#67
  67 | Return name=#68
  68 | Condition name=#69
  69 | Relation name=#70
  70 | Exp name=#71
  71 | Term name=#72
  72 | Factor name=#73
  73 | IdentifierExpression id='y'
  74 | Else body=#75
  75 | Object body=[#76]
  76 | Block names=#77
  77 | Return name=#78
  78 | Condition name=#79
  79 | Relation name=#80
  80 | Exp name=#81
  81 | Term name=#82
  82 | Factor name=#83
  83 | IdentifierExpression id='z'`;

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
  17 | Return value=#18
  18 | IdentifierExpression id='x'
  19 | Else block=#20
  20 | Object block=[#21,#26,#28]
  21 | Block statements=#22
  22 | Return value=#23
  23 | BinaryExp op='*' left=#24 right=#25
  24 | IdentifierExpression id='x'
  25 | IdentifierExpression id='call'
  26 | Block statements=#27
  27 | IdentifierExpression id='factoral'
  28 | Block statements=#29
  29 | BinaryExp op='-' left=#30 right=#31
  30 | IdentifierExpression id='x'
  31 | IdentifierExpression id='1'`;

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
    assert.deepStrictEqual(util.format(parse(source[0])), expectedAst3);
    done();
  });
});
