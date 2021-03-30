<<<<<<< HEAD
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
=======
import {
  Program,
  Block,
  Function,
  Params,
  While,
  For,
  If,
  Elif,
  Else,
  Assign,
  Print,
  Return,
  BinaryExp,
  IdentifierExpression,
} from "./ast.js";

//import * as stdlib from "./stdlib.js"

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

const check = self => ({
  // isNumeric() {
  //   must(
  //     [Type.INT, Type.FLOAT].includes(self.type),
  //     `Expected a number, found ${self.type.name}`
  //   )
  // },
  // isNumericOrString() {
  //   must(
  //     [Type.INT, Type.FLOAT, Type.STRING].includes(self.type),
  //     `Expected a number or string, found ${self.type.name}`
  //   )
  // },
  
  isBoolean() {
  //  must(self.condition instanceof Boolean, `Expected a boolean, found SOMETHING`)
  },
  
  // isInteger() {
  //   must(self.type === Type.INT, `Expected an integer, found ${self.type.name}`)
  // },
  isInsideALoop() {
    must(self.inLoop, "Break can only appear in a loop")
  },
  isInsideAFunction(context) {
    must(self.function, "Return can only appear in a function")
  },
  // isCallable() {
  //   must(
  //     self.constructor === StructDeclaration || self.type.constructor == FunctionType,
  //     "Call of non-function or non-constructor"
  //   )
  // },
  matchParametersOf(f) {
    check(self).match(f.params.factors)
  },
  matchFieldsOf(object) {
    check(self).match(structType.fields.map(f => f.type))
  },
})

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map()
    // Whether we are in a loop, so that we know whether breaks and continues
    // are legal here
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false
    // Whether we are in a function, so that we know whether a return
    // statement can appear here, and if so, how we typecheck it

    this.function = configuration.forFunction ?? parent?.function ?? null
  }
  
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name)
>>>>>>> da42a7289c2164ff6bf7c76c39814f20de397d84
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
<<<<<<< HEAD
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
=======
    p.statements = this.analyze(p.statements)
    return p
>>>>>>> da42a7289c2164ff6bf7c76c39814f20de397d84
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
<<<<<<< HEAD
  ClassCall(c) {
=======
  
  //this probably wont work :( (WIP)
  Assign(a) {
    // a.source = this.analyze(a.source)
    // a.target = new Assign(a.target, a.source)
    // return a

    a.source = this.analyze(a.source)
    // d.target = new Variable(d.target)
    this.add(a.target, a.source)
    return a
  }

  //pretty sure you can delete this
  Print(s){
    s.condition = this.analyze(s.condition)
    //check(s.condition).isNumericOrString
    return s
  }
  ClassCall(c){
>>>>>>> da42a7289c2164ff6bf7c76c39814f20de397d84
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
