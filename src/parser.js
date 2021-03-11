let fs = require("fs");

import ohm from "ohm-js";
import * as ast from "./ast.js";

const qcqGrammar = ohm.grammar(
  fs.readFileSync("../quotecodequote/Grammar/quotecodequote.ohm")
);

const astBuilder = aelGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast());
  },
  Body_function(name, ...params) {
    return new ast.Function(name.ast(), ...params.ast());
  },
  Body_while(statement) {
    return new ast.While(statement.ast());
  },
  Body_for(name, initial, final) {
    return new ast.For(name.ast(), initial.ast(), final.ast());
  },
  Body_if(statement) {
    return new ast.If(statement.ast());
  },
  Body_elseif(statement) {
    return new ast.ElseIf(statement.ast());
  },
  Body_else(statement) {
    return new ast.If(statement.ast());
  },
  Statement_vardec(id, _eq, initializer) {
    return new ast.VarDec(id.sourceString, initializer.ast());
  },
  Statement_assign(target, _eq, source) {
    return new ast.Assign(target.ast(), source.ast());
  },
  Statement_print(_print, argument) {
    return new ast.Print(argument.ast());
  },
  Exp_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },
  Term_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },
  Factor_unary(op, operand) {
    return new ast.UnaryExp(op.sourceString, operand.ast());
  },
  Var(id) {
    return new ast.IdentifierExpression(this.sourceString);
  },
  num(_whole, _point, _fraction) {
    return Number(this.sourceString);
  },
});

export default function parse(code) {
  const match = qcqGrammar.match(code);
  if (!match.succeeded) {
    throw new Error(match.message);
  }
}
