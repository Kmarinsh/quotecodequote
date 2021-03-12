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
  Function(_func, name, params, _is, block, _end) {
    return new ast.Function(name.ast(), params.ast(), block.ast());
  },
  Params(_of, param, _and, params) {
    return new ast.Params(param.ast(), params.ast());
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
  If(_if, condition, block,_end, elifstatement , elsestatement ) {
    return new ast.If(condition.ast(), block.ast(), elifstatement.ast(),elsestatement.ast());
  },
  Elif(_elif, condition, block,_end) {
    return new ast.Elif(condition.ast(), block.ast());
  },
  Else(_else, block,_end) {
    return new ast.Else(block.ast());
  },
  Assign(target, _is, source) {
    return new ast.Assign(target.ast(), source.ast());
  },
  Print(_output, argument) {
    return new ast.Print(argument.ast());
  },
  Return(_out, statement) {
    return new ast.Return(statement.ast());
  },

  Condition(exp) {
    return new ast.Condition(exp.ast());
  },
  Condition_logical(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Relation(exp) {
    return new ast.Relation(exp.ast());
  },
  
  Relation_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Exp(exp) {
    return new ast.Exp(exp.ast());
  },
  Exp_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Term(exp) {
    return new ast.Term(exp.ast());
  },
  Term_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Factor(exp) {
    return new ast.Factor(exp.ast());
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
  if (!match.succeeded()) {
    throw new Error(match.message);
  }
  return astBuilder(match).ast();
}