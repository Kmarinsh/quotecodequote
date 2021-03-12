import assert from "assert";
import util from "util";
import parse from "../src/parser.js";

const source = `
function factorial of x is
    if x == 0 or x == 1
        out: x
    else
        out: x * call factoral x-1
    end
end
`;

const expectedAst = String.raw`   1 | Program names=[#2]
   2 | Block names=#3
   3 | Function name=#4 params='of x' block=[#5]
   4 | IdentifierExpression id='factorial'
   5 | Block names=#6
   6 | Block names=#7
   7 | If condition=#8 body=[#33,#41,#48,#60,#67] elseifstatement=undefined elsestatement=undefined
   8 | Condition name=#9
   9 | BinaryExp op='or' left=#10 right=#22
  10 | Condition name=#11
  11 | Relation name=#12
  12 | BinaryExp op='==' left=#13 right=#18
  13 | Relation name=#14
  14 | Exp name=#15
  15 | Term name=#16
  16 | Factor name=#17
  17 | IdentifierExpression id='x'
  18 | Exp name=#19
  19 | Term name=#20
  20 | Factor name=#21
  21 | IdentifierExpression id='0'
  22 | Relation name=#23
  23 | BinaryExp op='==' left=#24 right=#29
  24 | Relation name=#25
  25 | Exp name=#26
  26 | Term name=#27
  27 | Factor name=#28
  28 | IdentifierExpression id='x'
  29 | Exp name=#30
  30 | Term name=#31
  31 | Factor name=#32
  32 | IdentifierExpression id='1'
  33 | Block names=#34
  34 | Return name=#35
  35 | Condition name=#36
  36 | Relation name=#37
  37 | Exp name=#38
  38 | Term name=#39
  39 | Factor name=#40
  40 | IdentifierExpression id='x'
  41 | Block names=#42
  42 | Condition name=#43
  43 | Relation name=#44
  44 | Exp name=#45
  45 | Term name=#46
  46 | Factor name=#47
  47 | IdentifierExpression id='else'
  48 | Block names=#49
  49 | Return name=#50
  50 | Condition name=#51
  51 | Relation name=#52
  52 | Exp name=#53
  53 | Term name=#54
  54 | BinaryExp op='*' left=#55 right=#58
  55 | Term name=#56
  56 | Factor name=#57
  57 | IdentifierExpression id='x'
  58 | Factor name=#59
  59 | IdentifierExpression id='call'
  60 | Block names=#61
  61 | Condition name=#62
  62 | Relation name=#63
  63 | Exp name=#64
  64 | Term name=#65
  65 | Factor name=#66
  66 | IdentifierExpression id='factoral'
  67 | Block names=#68
  68 | Condition name=#69
  69 | Relation name=#70
  70 | Exp name=#71
  71 | BinaryExp op='-' left=#72 right=#76
  72 | Exp name=#73
  73 | Term name=#74
  74 | Factor name=#75
  75 | IdentifierExpression id='x'
  76 | Term name=#77
  77 | Factor name=#78
  78 | IdentifierExpression id='1'`;

describe("The parser", () => {
  console.log(parse(source));
  it("can parse all the nodes", (done) => {
    assert.deepStrictEqual(util.format(parse(source)), expectedAst);
    done();
  });
});
