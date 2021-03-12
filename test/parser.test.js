import assert from "assert";
import { endianness } from "os";
import util from "util";
import parse from "../src/parser.js";

const source = [
  `
  function factorial of x is
    if x == 0 or x == 1
      out: x
    end
    else
      out: x * call factoral x-1
    end
  end
  `,

  `function average of x and y is
	  sum is x+y
	  out: sum/2
   end`,

  `
  function largestNum of x and y and z is
      if x >= y and x >= z
          out: x
      end
      elif y >= x and y >= z
          out: y
      end
      else
          out: z
      end
  end
  `,

  `
  output "hello, world"
  `,

  `
  loop i from 0 to 10 by 1
    call x with 1 and 3
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
      out: 5
    end
   `,
  
   `
   function hi of x and y is
      if x < y
        out: "x is less"
      end
      elif y > x
        out: "y is less"
      end
      else
        out: "equal"
      end
    end
   `,

   `
      if 5 < 3
        out: x
      end
      elif 3 > 4
        out: y
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
  `
  
  ];

  const badSource = [`if x`, `loop`]

const expectedAst1 = String.raw`   1 | Program names=[#2]
   2 | Block names=#3
   3 | Function name=#4 params=[#5] block=[#8]
   4 | IdentifierExpression id='factorial'
   5 | Params param=#6 params=[]
   6 | Factor name=#7
   7 | IdentifierExpression id='x'
   8 | Block names=#9
   9 | If condition=#10 body=[#35] elseifstatement=[] elsestatement=[#43]
  10 | Condition name=#11
  11 | BinaryExp op='or' left=#12 right=#24
  12 | Condition name=#13
  13 | Relation name=#14
  14 | BinaryExp op='==' left=#15 right=#20
  15 | Relation name=#16
  16 | Exp name=#17
  17 | Term name=#18
  18 | Factor name=#19
  19 | IdentifierExpression id='x'
  20 | Exp name=#21
  21 | Term name=#22
  22 | Factor name=#23
  23 | IdentifierExpression id='0'
  24 | Relation name=#25
  25 | BinaryExp op='==' left=#26 right=#31
  26 | Relation name=#27
  27 | Exp name=#28
  28 | Term name=#29
  29 | Factor name=#30
  30 | IdentifierExpression id='x'
  31 | Exp name=#32
  32 | Term name=#33
  33 | Factor name=#34
  34 | IdentifierExpression id='1'
  35 | Block names=#36
  36 | Return name=#37
  37 | Condition name=#38
  38 | Relation name=#39
  39 | Exp name=#40
  40 | Term name=#41
  41 | Factor name=#42
  42 | IdentifierExpression id='x'
  43 | Else body=#44
  44 | Object body=[#45,#57,#64]
  45 | Block names=#46
  46 | Return name=#47
  47 | Condition name=#48
  48 | Relation name=#49
  49 | Exp name=#50
  50 | Term name=#51
  51 | BinaryExp op='*' left=#52 right=#55
  52 | Term name=#53
  53 | Factor name=#54
  54 | IdentifierExpression id='x'
  55 | Factor name=#56
  56 | IdentifierExpression id='call'
  57 | Block names=#58
  58 | Condition name=#59
  59 | Relation name=#60
  60 | Exp name=#61
  61 | Term name=#62
  62 | Factor name=#63
  63 | IdentifierExpression id='factoral'
  64 | Block names=#65
  65 | Condition name=#66
  66 | Relation name=#67
  67 | Exp name=#68
  68 | BinaryExp op='-' left=#69 right=#73
  69 | Exp name=#70
  70 | Term name=#71
  71 | Factor name=#72
  72 | IdentifierExpression id='x'
  73 | Term name=#74
  74 | Factor name=#75
  75 | IdentifierExpression id='1'`;

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


  const expectedAst3 = String.raw`   1 | Program names=[#2]
   2 | Block names=#3
   3 | Function name=#4 params='of x and y' block=[#5,#18]
   4 | IdentifierExpression id='average'
   5 | Block names=#6
   6 | VarDec name='sum' initializer=#7
   7 | Condition name=#8
   8 | Relation name=#9
   9 | Exp name=#10
  10 | BinaryExp op='+' left=#11 right=#15
  11 | Exp name=#12
  12 | Term name=#13
  13 | Factor name=#14
  14 | IdentifierExpression id='x'
  15 | Term name=#16
  16 | Factor name=#17
  17 | IdentifierExpression id='y'
  18 | Block names=#19
  19 | Return name=#20
  20 | Condition name=#21
  21 | Relation name=#22
  22 | Exp name=#23
  23 | Term name=#24
  24 | BinaryExp op='/' left=#25 right=#28
  25 | Term name=#26
  26 | Factor name=#27
  27 | IdentifierExpression id='sum'
  28 | Factor name=#29
  29 | IdentifierExpression id='2'`


describe("The parser", () => {
  for(let program of source){
   it("can parse all the nodes", (done) => {
      assert.ok(parse(program));
      done();
    });
  }

  for(let program of badSource){
    it("rejects", (done) => {
       assert.throws(() => parse(program));
       done();
     });
   }
});

describe("Direct checking Factorial AST", () => {
  it("checked directly against ast", (done) => {
    assert.deepStrictEqual(util.format(parse(source[0])), expectedAst1);
    done();
  });
});



