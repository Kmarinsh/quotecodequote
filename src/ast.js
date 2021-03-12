import util from "util";

export class Program {
  constructor(names) {
    this.names = names;
  }
  [util.inspect.custom]() {
    return prettied(this);
  }
}

export class Block {
  constructor(names) {
    this.names = names;
  }
}

export class Function {
  constructor(name, params, block) {
    Object.assign(this, { name, params, block });
  }
}

export class Params {
  constructor(param, params) {
    Object.assign(this, { param, params });
  }
}

export class While {
  constructor(condition, block) {
    Object.assign(this, { condition, block });
  }
}

export class For {
  constructor(name, initial, final, increment, block) {
    Object.assign(this, { name, initial, final, increment, block });
  }
}

export class If {
  constructor(condition, body, elseifstatement, elsestatement) {
    Object.assign(this, { condition, body, elseifstatement, elsestatement });
  }
}

export class Elif {
  constructor(condition, body) {
    Object.assign(this, { condition, body });
  }
}

export class Else {
  constructor(body) {
    this.body = { body };
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

export class Return {
  constructor(name) {
    this.name = name;
  }
}

export class Condition {
  constructor(name) {
    this.name = name;
  }
}

export class Relation {
  constructor(name) {
    this.name = name;
  }
}

export class Exp {
  constructor(name) {
    this.name = name;
  }
}

export class Term {
  constructor(name) {
    this.name = name;
  }
}

export class Factor {
  constructor(name) {
    this.name = name;
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
  constructor(id) {
    this.id = id;
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
