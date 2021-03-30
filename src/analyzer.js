// Semantic Analyzer
//
// Analyzes the AST by looking for semantic errors and resolving references.

class Context {
  constructor(context) {
    // Currently, the only analysis context needed is the set of declared
    // variables. We store this as a map, indexed by the variable name,
    // for efficient lookup. More complex languages will a lot more here,
    // such as the current function (to validate return statements), whether
    // you were in a loop (for validating breaks and continues), and a link
    // to a parent context for static scope analysis.
    this.locals = new Map();
  }
  add(name, entity) {
    if (this.locals.has(name)) {
      throw new Error(`Identifier ${name} already declared`);
    }
    this.locals.set(name, entity);
  }
  lookup(name) {
    const entity = this.locals.get(name);
    if (entity) {
      return entity;
    }
    throw new Error(`Identifier ${name} not declared`);
  }
  analyze(node) {
    console.log("analyze: " + this[node.constructor.name]);
    return this[node.constructor.name](node);
  }
  Program(p) {
    console.log("P: " + p.blocks.constructor);
    this.analyze(p.blocks);
  }
  Block(b) {
    console.log("B: " + b.statements);
    this.analyze(b.statements);
  }
  Assign(a) {
    this.analyze(a.source);
    this.add(a.target, a);
    this.analyze(a.target);
  }
  Print(a) {
    this.analyze(a.argument);
  }
  IdentifierExpression(e) {
    //nothing needed here
  }
  Field(f) {
    f.fields = this.analyze(f.fields);
    return f;
  }
  Function(d) {
    const f = (d.function = new Function(d.id));
    const childContext = this.newChild({ inLoop: false, forFunction: f });
    d.params = childContext.analyze(d.params);
    this.add(f.id, f);
    d.block = childContext.analyze(d.block);
    return d;
  }
  Params(p) {
    p.factors = this.analyze(p.factors);
    this.add(p.id, p.factors);
    return p;
  }
  While(s) {
    s.condition = this.analyze(s.condition);
    check(s.test).isBoolean();
    s.block = this.newChild({ inLoop: true }).analyze(s.block);
    return s;
  }
  For(s) {
    s.initial = this.analyze(s.initial);
    check(s.low).isInteger();
    s.final = this.analyze(s.final);
    check(s.final).isInteger();
    s.id = new Assign(s.id, s.initial);
    s.block = this.newChild({ inLoop: true }).analyze(s.block);
    return s;
  }
  If(s) {
    s.condition = this.analyze(s.condition);
    check(s.condition).isBoolean();
    s.block = this.newChild().analyze(s.block);

    //Might have to do this in the Elif below
    s.elifstatement.condition = this.analyze(s.elifstatement.condition);
    check(s.elifstatement.condition).isBoolean();
    s.elifstatement.block = this.newChild().analyze(s.elifstatement.block);
    return s;
  }
  //pretty sure we can delete these
  // Elif(s) {
  // }
  // Else(s) {
  // }
  ClassCall(c) {
    // c.id = this.analyze(c.id)
    // // check(c.id).isCallable()
    // c.fields = this.analyze(c.fields)
    // check(c.fields).matchParametersOf(c.id.type)
    return c;
  }
  FuncCall(c) {
    c.id = this.analyze(c.id);
    //Assume it is callable
    c.params = this.analyze(c.params);
    //Check that C params matches c.id.parameters.fields
    //FuncCall -> mathParametersOf -> Function -> Parameters
    check(c.params).matchParametersOf(c.id);
    return c;
  }
  // Args(a) {
  //   //not sure we need this
  // }
  Return(s) {
    check(this).isInsideAFunction();
    return s;
  }
  BinaryExpression(e) {
    return e;
  }
  IdentifierExpression(e) {
    return e;
  }
  Array(a) {
    a.forEach((entity) => this.analyze(entity));
  }
}

export default function analyze(node) {
  new Context().analyze(node);
  return node;
}
