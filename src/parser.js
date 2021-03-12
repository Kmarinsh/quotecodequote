import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const qcqGrammar = ohm.grammar(
  fs.readFileSync("../quotecodequote/Grammar/quotecodequote.ohm")
);

const astBuilder = qcqGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast());
  },
  Block(statements) {
    return new ast.Block(statements.ast());
  },
  Block_conditional(ifstatement, elseifstatement, elsestatement) {
    return new ast.If(ifstatement.ast());
  },
  Function(_func, name, params, _is, block, _end) {
    return new ast.Function(name.ast(), params.sourceString, block.ast());
  },
  Params(_of, param, _and, params) {
    return new ast.Params(param, params);
  },
  While(_loop, _until, condition, block, _end) {
    return new ast.While(condition.ast(), block.ast());
  },
  For(_loop, name, _from, initial, _to, final, _by, increment, block, _end) {
    return new ast.For(
      name.ast(),
      initial.ast(),
      final.ast(),
      increment.ast(),
      block.ast()
    );
  },
  If(_if, condition, block, elseIf, elseStatement, _end) {
    return new ast.If(
      condition.ast(),
      block.ast(),
      elseIf.ast(),
      elseStatement.ast()
    );
  },
  ElseIf(_else, _if, condition, block) {
    return new ast.ElseIf(condition.ast(), block.ast());
  },
  Else(_else, block) {
    return new ast.Else(block.ast());
  },
  VarDec(id, _is, initializer) {
    return new ast.VarDec(id.sourceString, initializer.ast());
  },
  Assign(target, _is, source) {
    return new ast.Assign(target.ast(), source.ast());
  },
  Print(_output, argument) {
    return new ast.Print(argument.ast());
  },
  FuncCall_withArgs(_call, name, _with, param1, _comma, paramR) {
    return new ast.FuncCall(name.ast(), param1.ast(), paramR.ast());
  },
  FuncCall_noArgs(_call, name) {
    return new ast.FuncCall(name.ast());
  },
  Return(_out, statement) {
    return new ast.Return(statement.ast());
  },

  Condition_logical(left, op, right) {
    return new ast.Condition(op, left, right);
  },

  Relation_binary(left, op, right) {
    return new ast.Relation(op, left, right);
  },

  Exp_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Term_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Factor_string(_quote1, id, _quote2) {
    return new ast.IdentifierExpression(this.sourceString);
  },
  Var(id) {
    return new ast.IdentifierExpression(this.sourceString);
  },
  id(id, _other) {
    return new ast.IdentifierExpression(this.sourceString);
  },
  number(id, _point, decimal) {
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
