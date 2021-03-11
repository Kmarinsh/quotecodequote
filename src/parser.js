import ohm from "ohm-js";
import * as ast from "./ast.js";

const qcqGrammar = ohm.grammar(`
  codequotecode {
    Program   = Block+
    
    Block = 
          Function
              | While
              | For
              | If
              | ElseIf
              | Else
              | Statement
              
     Function = function Var "in:" Var ("," Var)* 
              newline indent (Block )* dedent 
     
     While = 
            loop until Relop                 
                newline indent (Block )*
               dedent "end" newline 
    For =
                loop id from number to number by number 
                  newline indent  (Block )* 
                dedent "end" newline 
     
     If =  | if Relop 
              newline indent (Block )* dedent
               
    ElseIf=
           else if Relop 
                newline indent (Block )*
               dedent
               
    Else=
          else 
                newline indent (Block )*
               dedent
          
    
    Statement =  
              | VarDec
              | Assign
              | Print
              | FuncCall    
              | Return 
              | Relop 
              
    VarDec=id "is" Relop  newline?
    
    Assign=Var is Relop  newline?
    
    Print= output Relop newline? 
    
    FuncCall=call id Var ( "," Var )*
    
    Return=out Relop newline?
              
    Relop = Relop ("and" | "or" | "<=" | ">=" | "<" | ">" | "==" | "!=")  Exp        --binary
              | Exp                                                 --unary
              
    Exp       = Exp ("+" | "-") Term            --binary
              | Term
              
    Term      = Term ("*"| "/"|"^"|"%") Factor          --binary
              | Factor
              
    Factor    = Var 
              | number
              | "'" (~" ' " ~" ' " ~newline any | escape)* " ' "                 --string
              | list "[" (Factor ( "," Factor )* )? "]"              --list
              | map "[" ( "[" id ":" Factor "]"  ( ","  "[" id ":" Factor "]" )* )? "]"  --map
              | "(" Exp ")"                     --parens
              
    Var       = id
    
    number       = digit+ ("." digit+)?
    list = "list" ~alnum
    map="map" ~alnum
    loop="loop" ~alnum
    until="until" ~alnum
    from="from" ~alnum
    to="to" ~alnum
    by="by" ~alnum
    function="function" ~alnum
    if="if" ~alnum 
    out = "out:" ~alnum
    else="else" ~alnum
    is       = "is" ~alnum
    output     = "output" ~alnum
    keyword   = is | output | loop | until | from | to | by | function | if | map | list | "out:" | "call:"
    id        = ~keyword letter alnum*
    call    = "call:" ~alnum
    
    newline= "\\n"+
      indent      = "\\t"
    dedent      = "⇦"
    space       := " "  | comment
    comment     = "!!!" (~"newline" any)* newline                            -- singleLine
                | "!?" (~"?!" any)* "?!"                             -- multiLine
    escape      = "\\\""
              }`);

const astBuilder = qcqGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast());
  },
  Function(
    _function,
    name,
    _in,
    param1,
    _comma,
    paramR,
    _newline,
    _indent,
    block,
    _dedent
  ) {
    return new ast.Function(
      name.ast(),
      param1.ast(),
      paramR.ast(),
      block.ast()
    );
  },
  While(
    _loop,
    _until,
    condition,
    _newline,
    _indent,
    block,
    _dedent,
    _end,
    _newline2
  ) {
    return new ast.While(condition.ast(), block.ast());
  },
  For(
    _loop,
    name,
    _from,
    initial,
    _to,
    final,
    _by,
    increment,
    _newline,
    _indent,
    block,
    _dedent,
    _end,
    _newline2
  ) {
    return new ast.For(
      name.ast(),
      initial.ast(),
      final.ast(),
      increment.ast(),
      block.ast()
    );
  },
  If(_if, statement, _newline, _indent, block, _dedent) {
    return new ast.If(statement.ast(), block.ast());
  },
  ElseIf(_else, _if, statement, _newline, _indent, block, _dedent) {
    return new ast.ElseIf(statement.ast(), block.ast());
  },
  Else(_else, _newline, _indent, block, _dedent) {
    return new ast.If(statement.ast(), block.ast());
  },
  VarDec(id, _is, initializer, _newline) {
    return new ast.VarDec(id.sourceString, initializer.ast());
  },
  Assign(target, _eq, source, _newline) {
    return new ast.Assign(target.ast(), source.ast());
  },
  Print(_print, argument, _newline) {
    return new ast.Print(argument.ast());
  },
  FuncCall(_call, name, param1, _comma, paramR) {
    return new ast.FuncCall(name.ast(), param1.ast(), paramR.ast());
  },
  Return(_out, statement, _newline) {
    return new ast.Return(statement.ast());
  },
  Exp_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },
  Term_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },
  Var(id) {
    return new ast.IdentifierExpression(this.sourceString);
  },
});

export default function parse(code) {
  const match = qcqGrammar.match(code);
  if (!match.succeeded) {
    throw new Error(match.message);
  }
  return astBuilder(match).ast();
}
