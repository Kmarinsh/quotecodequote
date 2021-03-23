import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const qcqGrammar = ohm.grammar(
  fs.readFileSync("../quotecodequote/Grammar/quotecodequote.ohm")
);

const astBuilder = qcqGrammar.createSemantics().addOperation("ast", {
  Program(block) {
    return new ast.Program(block.ast());
  },
  Block(statements) {
    return new ast.Block(statements.ast());
  },

  Class(_class, id, fields, methods, _end) {
    return new ast.Class(id.ast(), fields.ast(), methods.ast());
  },
  Field(_has, field, _and, fields) {
    return new ast.Field([field.ast(), ...fields.ast()]);
  },
  Method(name, params, _is, body, _end) {
    return new ast.Method(name.ast(), params.ast(), body.ast());
  },

  Function(_func, name, params, _is, block, _end) {
    return new ast.Function(name.ast(), params.ast(), block.ast());
  },
  Params(_of, param, _and, params) {
    return new ast.Params([param.ast(), ...params.ast()]);
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
  If(_if, condition, block, _end, elifstatement, elsestatement) {
    return new ast.If(
      condition.ast(),
      block.ast(),
      elifstatement.ast(),
      elsestatement.ast()
    );
  },
  Elif(_elif, condition, block, _end) {
    return new ast.Elif(condition.ast(), block.ast());
  },
  Else(_else, block, _end) {
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

  ClassCall(_new, id, args) {
    return new ast.ClassCall(id.ast(), args.ast());
  },

  FuncCall(_call, id, args) {
    return new ast.FuncCall(id.ast(), args.ast());
  },

  Args(_with, id, _as, exp, _and, ids, _as2, exps) {
    return new ast.Args([id.ast(), ...ids.ast()], [exp.ast(), ...exps.ast()]);
  },

  Condition_logical(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
  },

  Relation_binary(left, op, right) {
    return new ast.BinaryExp(op.sourceString, left.ast(), right.ast());
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
  Factor_parens(_openP, exp, _closeP) {
    return new ast.IdentifierExpression(exp.sourceString);
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
