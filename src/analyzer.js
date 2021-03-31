// Semantic Analyzer
//
// Analyzes the AST by looking for semantic errors and resolving references.
import { assert } from "node:console";
import { Assign } from "./ast.js";
function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

const check = (self) => ({
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
    must(self.inLoop, "Break can only appear in a loop");
  },
  isInsideAFunction(context) {
    must(self.function, "Return can only appear in a function");
  },
  isCallable() {
    must(
      self.constructor === StructDeclaration ||
        self.type.constructor == FunctionType,
      "Call of non-function or non-constructor"
    );
  },
  matchParametersOf(f) {
    // check(self).match(f.params.factors);
    must( self == f , "Arguments of function call must match that of the function")
  },
  matchFieldsOf(object) {
    check(self).match(structType.fields.map((f) => f.type));
  },
});

class Context {
  constructor(context, parent = null, configuration = {}) {
    // Currently, the only analysis context needed is the set of declared
    // variables. We store this as a map, indexed by the variable name,
    // for efficient lookup. More complex languages will a lot more here,
    // such as the current function (to validate return statements), whether
    // you were in a loop (for validating breaks and continues), and a link
    // to a parent context for static scope analysis.
    this.locals = new Map();
    this.parent = parent;
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false;
    this.function = configuration.forFunction ?? parent?.function ?? null;
  }
  add(name, entity) {
    // if (this.locals.has(name)) {
    //   throw new Error(`Identifier ${name} already declared`);
    // }
    this.locals.set(name, entity);
  }
  lookup(name) {
    const entity = this.locals.get(name);
    if (entity) {
      return entity;
    }
    throw new Error(`Identifier ${name} not declared`);
  }
  // newChild(configuration = {}) {
  //   return new Context(this, configuration)
  // }
  analyze(node) {
    return this[node.constructor.name](node);
  }
  Program(p) {
    this.analyze(p.blocks);
  }
  Block(b) {
    this.analyze(b.statements);
  }
  Class(c) {}
  Field(f) {
    f.fields = this.analyze(f.fields);
    return f;
  }
  Method(m) {}
  Function(d) {
    // if (d.params) {
    //   this.analyze(d.params);
    // }
    this.add(d.id, d.params)
    this.analyze(d.block);
  }
  FuncCall(c) {
    console.log(c.args)
    console.log(this.get(c.id))
    check(c.args).matchParametersOf(this.get(c.id))
  }
  ClassAttr(c) {
    check(c.args)
  }
  // Params(p) {}
  While(s) {
    if (s.condition) {
      this.analyze(s.block);
    }
  }
  For(s) {
    s.id = new Assign(s.id, s.initial);
    this.analyze(s.block);
    return s;
  }
  If(s) {
    if (s.condition) {
      this.analyze(s.block);
      if (s.elifstatement.condition) {
        this.analyze(s.elifstatement.constructor.block);
      }
      if (s.elsestatement.block) {
        this.analyze(s.elsestatement.constructor.block);
      }
    } else {
      throw new Error(`If statements must have a condition`);
    }
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
    this.lookup(e.id);
  }
  ClassCall(c) {}
  Args(a) {
    //not sure we need this
  }
  Return(s) {}
  BinaryExp(e) {
    this.analyze(e.left);
    this.analyze(e.right);
    this.op = this.op;
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
