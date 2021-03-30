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
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name)
    if (entity) {
      return entity
    } else if (this.parent) {
      return this.parent.lookup(name)
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  newChild(configuration = {}) {
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.statements = this.analyze(p.statements)
    return p
  }

//pretty sure we can remove these three
  // Class(c) {

  // }
  Field(f) {
    f.fields = this.analyze(f.fields)
    return f
  }
  // Method(m) {
  //   //
  // }
//--

  Function(d) {
    const f = (d.function = new Function(d.id))
    const childContext = this.newChild({ inLoop: false, forFunction: f})
    d.params = childContext.analyze(d.params)
    this.add(f.id, f)
    d.block = childContext.analyze(d.block)
    return d
    
  }
  Params(p) {
    p.factors = this.analyze(p.factors)
    this.add(p.id, p.factors)
    return p
  }
  While(s) {
    s.condition = this.analyze(s.condition)
    check(s.test).isBoolean()
    s.block = this.newChild({ inLoop: true }).analyze(s.block)
    return s
  }
  For(s) {
    s.initial = this.analyze(s.initial)
    check(s.low).isInteger()
    s.final = this.analyze(s.final)
    check(s.final).isInteger()
    s.id = new Assign(s.id, s.initial)
    s.block = this.newChild({ inLoop: true }).analyze(s.block)
    return s
  }
  If(s) {
    s.condition = this.analyze(s.condition)
    check(s.condition).isBoolean()
    s.block = this.newChild().analyze(s.block)
    
    //Might have to do this in the Elif below
    s.elifstatement.condition = this.analyze(s.elifstatement.condition)
    check(s.elifstatement.condition).isBoolean()
    s.elifstatement.block = this.newChild().analyze(s.elifstatement.block)
    return s
  }

  //pretty sure we can delete these
  // Elif(s) {

  // }
  // Else(s) {

  // }
  
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
    // c.id = this.analyze(c.id)
    // // check(c.id).isCallable()
    // c.fields = this.analyze(c.fields)
    // check(c.fields).matchParametersOf(c.id.type)
    return c
  }
  FuncCall(c){
    c.id = this.analyze(c.id)
    //Assume it is callable
    c.params = this.analyze(c.params)
    //Check that C params matches c.id.parameters.fields
    //FuncCall -> mathParametersOf -> Function -> Parameters
    check(c.params).matchParametersOf(c.id)
    return c
  }
  // Args(a) {
  //   //not sure we need this
  // }
  Return(s) {
    check(this).isInsideAFunction()
    return s
  }
  BinaryExpression(e) {
    // e.left = this.analyze(e.left)
    // e.right = this.analyze(e.right)
    // if (["&", "|", "^", "<<", ">>"].includes(e.op)) {
    //   check(e.left).isInteger()
    //   check(e.right).isInteger()
    //   e.type = Type.INT
    // } else if (["+"].includes(e.op)) {
    //   check(e.left).isNumericOrString()
    //   check(e.left).hasSameTypeAs(e.right)
    //   e.type = e.left.type
    // } else if (["-", "*", "/", "%", "**"].includes(e.op)) {
    //   check(e.left).isNumeric()
    //   check(e.left).hasSameTypeAs(e.right)
    //   e.type = e.left.type
    // } else if (["<", "<=", ">", ">="].includes(e.op)) {
    //   check(e.left).isNumericOrString()
    //   check(e.left).hasSameTypeAs(e.right)
    //   e.type = Type.BOOLEAN
    // } else if (["==", "!="].includes(e.op)) {
    //   check(e.left).hasSameTypeAs(e.right)
    //   e.type = Type.BOOLEAN
    // }
    return e
  }
  IdentifierExpression(e) {
    return e
  }

}

export default function analyze(node) {
  // Allow primitives to be automatically typed
  // Number.prototype.type = Type.FLOAT
  // BigInt.prototype.type = Type.INT
  // Boolean.prototype.type = Type.BOOLEAN
  // String.prototype.type = Type.STRING
  // Type.prototype.type = Type.TYPE
  const initialContext = new Context()

  // Add in all the predefined identifiers from the stdlib module
  //const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions }
  // for (const [name, type] of Object.entries(library)) {
  //   initialContext.add(name, type)
  // }
  return initialContext.analyze(node)
}
