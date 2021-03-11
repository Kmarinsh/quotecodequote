import util from "util";

export class Program {
  constructor(statements) {
    this.statements = statements;
  }
  [util.inspect.custom]() {
    return prettied(this);
  }
}

export class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

export class Function {
  constructor(name, ...params) {
    Object.Assign(this, { name, params });
  }
}

export class While {
  constructor(statement) {
    this.statements = { statement };
  }
}

export class For {
  constructor(name, initial, final) {
    Object.Assign(name, { name, initial, final });
  }
}

export class If {
  constructor(statement) {
    this.statements = { statement };
  }
}

export class ElseIf {
  constructor(statement) {
    this.statements = { statement };
  }
}

export class Else {
  constructor(statement) {
    this.statements = { statement };
  }
}

export class VarDec {
  constructor(name, initializer) {
    Object.assign(this, { name, initializer });
  }
}

export class Assign {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

export class Print {
  constructor(argument) {
    this.argument = argument;
  }
}

//covers all binary statements
export class BinaryExp {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

//covers all unary statements
export class UnaryExp {
  constructor(op, operand) {
    Object.assign(this, { op, operand });
  }
}

//covers all statements leading directly to another class
export class IdentifierExpression {
  constructor(name) {
    this.name = name;
  }
}

// function prettied(node) {
//   // Return a compact and pretty string representation of the node graph,
//   // taking care of cycles. Written here from scratch because the built-in
//   // inspect function, while nice, isn't nice enough.
//   const seen = new Map()

//   function setIds(node) {
//     if (node === null || typeof node !== "object" || seen.has(node)) return
//     seen.set(node, seen.size + 1)
//     for (const child of Object.values(node)) {
//       if (Array.isArray(child)) child.forEach(setIds)
//       else setIds(child)
//     }
//   }

//   function* lines() {
//     function view(e) {
//       if (seen.has(e)) return `#${seen.get(e)}`
//       if (Array.isArray(e)) return `[${e.map(view)}]`
//       return util.inspect(e)
//     }
//     for (let [node, id] of [...seen.entries()].sort((a, b) => a[1] - b[1])) {
//       let [type, props] = [node.constructor.name, ""]
//       for (const [prop, child] of Object.entries(node)) {
//         props += ` ${prop}=${view(child)}`
//       }
//       yield `${String(id).padStart(4, " ")} | ${type}${props}`
//     }
//   }

//   setIds(node)
//   return [...lines()].join("\n")
// }
