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
  matchParametersOf(f) {
    must(self.length == f.length, "Calls must have the same number of parameters as the callee")
    for(let i=0; i < f.length; i++) {
      must( self[i].id == f[i].id, "Arguments of calls must match that of the callee")
    }
  },

});

class Context {
  constructor(context, parent = null, configuration = {}) {
    this.locals = new Map();
  }
  add(name, entity) {
    this.locals.set(name, entity);
  }
  analyze(node) {
    return this[node.constructor.name](node);
  }
  Program(p) {
    this.analyze(p.blocks);
  }
  Block(b) {
    this.analyze(b.statements);
  }

  Class(c) {
    this.add(c.id, c.fields)
    this.analyze(c.methods)
  }
  ClassCall(c) {
    let exist=0
    function checkClasses(value, key, map, ) {
      if (key.id == c.id.id) {
          exist++
      }
    }
    function checkArgs(value, key, map) {
      if (key.id == c.id.id) {
        check(c.args[0].id).matchParametersOf(value[0].fields)
      }
    } 
    this.locals.forEach(checkClasses)
    must(exist>=1, "Class has not been declared")

    this.locals.forEach(checkArgs)
  }
  Method(m) {
    this.add(m.id, m.params)
    this.analyze(m.block)
  } 
  ClassAttr(c) {
    let exist=0
    let sourceValue
    let localValue
    function checkAttribute(value, key, map, ) {
      if (key.id == c.method.id ) {
          exist++
      }      
      for(let i=0; i<localValue[0].fields.length; i++){
        if (localValue[0].fields[i].id == c.params?.id[0].id) {
          exist++
        }
        if (localValue[0].fields[i].id == c.method?.id) {
          exist++
        }
      }
    }
    function checkArgs(value, key, map) {
      if (key.id == c.method.id) {
          check(c.params.id).matchParametersOf(value[0].factors)
      }
    }

    function findSource(value, key, map) {
      if (key.id == c.source.id) {
        sourceValue = value
      }
    }
    function findLocal(value, key, map) {
      if (sourceValue?.source.id.id == key.id) {
        localValue = value
      }
    }
    this.locals.forEach(findSource)
    this.locals.forEach(findLocal)
    this.locals.forEach(checkAttribute)
    must(exist>=1, `Class does not have attribute`)
    this.locals.forEach(checkArgs)
  }
  Function(d) {
    this.add(d.id, d.params)
    this.analyze(d.block);
  }
  FuncCall(c) {
    function checkArgs(value, key, map) {
      if (key.id == c.id.id) {
        check(c.args[0].id).matchParametersOf(value[0].factors)
      }
    }     
    this.locals.forEach(checkArgs)
  }
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
      if (s.elifstatement.length > 0) {
        s.elifstatement.forEach(statement=>this.analyze(statement.block))
        //this.analyze(s.elifstatement[0].block);
      }
      if (s.elsestatement.length > 0) {
        this.analyze(s.elsestatement[0].block.block);
      }
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
  Return(s) {
    return s
  }
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
  const initialContext = new Context()
  initialContext.analyze(node);
  return node;
}
