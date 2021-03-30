import util from "util";

export class Program {
  constructor(blocks) {
    this.blocks = blocks;
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

export class Class {
  constructor(id, fields, methods) {
    Object.assign(this, { id, fields, methods });
  }
}

export class Field {
  constructor(fields) {
    Object.assign(this, { fields });
  }
}

export class Method {
  constructor(id, params, block) {
    Object.assign(this, { id, params, block });
  }
}

export class Function {
  constructor(id, params, block) {
    Object.assign(this, { id, params, block });
  }
}

export class Params {
  constructor(factors) {
    Object.assign(this, { factors });
  }
}

export class While {
  constructor(condition, block) {
    Object.assign(this, { condition, block });
  }
}

export class For {
  constructor(id, initial, final, increment, block) {
    Object.assign(this, { id, initial, final, increment, block });
  }
}

export class If {
  constructor(condition, block, elifstatement, elsestatement) {
    Object.assign(this, { condition, block, elifstatement, elsestatement });
  }
}

export class Elif {
  constructor(condition, block) {
    Object.assign(this, { condition, block });
  }
}

export class Else {
  constructor(block) {
    this.block = { block };
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

export class ClassCall {
  constructor(id, args) {
    Object.assign(this, { id, args });
  }
}

export class FuncCall {
  constructor(id, args) {
    Object.assign(this, { id, args });
  }
}

export class Args {
  constructor(id, Exp) {
    Object.assign(this, { id, Exp });
  }
}

export class Return {
  constructor(value) {
    this.value = value;
  }
}

//covers all binary names
export class BinaryExp {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

//covers all names leading directly to another class
export class IdentifierExpression {
  constructor(name) {
    this.name = name;
  }
}

function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const seen = new Map();

  function setIds(node) {
    if (node === null || typeof node !== "object" || seen.has(node)) return;
    seen.set(node, seen.size + 1);
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) child.forEach(setIds);
      else setIds(child);
    }
  }

  function* lines() {
    function view(e) {
      if (seen.has(e)) return `#${seen.get(e)}`;
      if (Array.isArray(e)) return `[${e.map(view)}]`;
      return util.inspect(e);
    }
    for (let [node, id] of [...seen.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""];
      for (const [prop, child] of Object.entries(node)) {
        props += ` ${prop}=${view(child)}`;
      }
      yield `${String(id).padStart(4, " ")} | ${type}${props}`;
    }
  }

  setIds(node);
  return [...lines()].join("\n");
}
