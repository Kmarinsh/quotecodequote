// Code Generator Carlos -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

//import { IfStatement, Type, StructType } from "./ast.js"
//import * as stdlib from "./stdlib.js"

export default function generate(program) {
  const output = []

  // const standardFunctions = new Map([
  //   [stdlib.functions.output, x => `console.log(${x})`],
  //   [stdlib.functions.out, x => `return ${x}`],
  //   [stdlib.functions.sin, x => `Math.sin(${x})`],
  //   [stdlib.functions.cos, x => `Math.cos(${x})`],
  //   [stdlib.functions.exp, x => `Math.exp(${x})`],
  //   [stdlib.functions.ln, x => `Math.log(${x})`],
  //   [stdlib.functions.hypot, ([x, y]) => `Math.hypot(${x},${y})`],
  //   [stdlib.functions.bytes, s => `[...Buffer.from(${s}, "utf8")]`],
  //   [stdlib.functions.codepoints, s => `[...(${s})].map(s=>s.codePointAt(0))`],
  // ])

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So, the Carlos variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  // const targetName = (mapping => {
  //   return entity => {
  //     if (!mapping.has(entity)) {
  //       mapping.set(entity, mapping.size + 1)
  //     }
  //     return `${entity.name ?? entity.description}_${mapping.get(entity)}`
  //   }
  // })(new Map())

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      p.blocks.forEach(block => gen(block))
    },
    Block(b){
      gen(b.statements)
    },
    Class(c){
      output.push(`class ${gen(c.id)} {\nconstructor(${c.fields.length === 0 ? "" : gen(c.fields[0])}) {`)
      if (c.fields.length !== 0){
        c.fields[0].fields.forEach(field => output.push(`this.${field.id} = ${field.id}`))
        output.push("}")
        c.fields[0].fields.forEach(field=> output.push(`get_${field.id}() { return this.${field.id} }`))
      }
      else { output.push("}") }
      c.methods.forEach(method => gen(method))
      output.push("}")
    },
    Field(f) {
      const fieldIDS = []
      f.fields.forEach(f => fieldIDS.push(f.id))
      return (`${fieldIDS.join(", ")}`)
    },
    Method(m) {
      output.push(`${gen(m.id)}(${m.params.length === 0 ? "" : gen(m.params[0]) }) {`)
      m.block.forEach(b => gen(b))
      output.push("}")
    },
    ClassAttr(c) {
      if (c.params?.id.length > 0){
        const args = []
        c.params.Exp.forEach(e => args.push(e.id))
        return (`${c.source.id}.${c.method.id}(${args.join(", ")})`)
      }
      else{
        return (`${c.source.id}.get_${gen(c.method)}()`)
      }
    },
    Function(d) {
      //${d.params.length === 0 ? "" : d.params[0].factors.forEach(f => `${gen(f)}`) }
      output.push(`function ${gen(d.id)}(${d.params.length === 0 ? "" : gen(d.params[0]) }) {`)
      d.block.forEach(b => gen(b))
      output.push("}")
    },
    Params(p) { 
      //console.log(p.factors.forEach(f => output.push(gen(f))).join(", "))
      const ids = []
      p.factors.forEach(f => ids.push(f.id))
      return (`${ids.join(", ")}`)
    },
    While(s) {
      output.push(`while (!(${gen(s.condition)})) {`)
      s.block.forEach(b => gen(b))
      output.push("}")
    },
    For(s) {
      //const i = targetName(s.id.target.id)
      const i = s.id.target.id
      const op = (s.increment.id > 0) ? `<=` : `>=`
      output.push(`for (let ${i} = ${s.initial.id}; ${i} ${op} ${(s.final.id)}; ${i} = ${i} + ${s.increment.id}) {`)
      s.block.forEach(b => gen(b))
      output.push("}")
    },
    If(s) {
      output.push(`if (${gen(s.condition)}) {`)
      s.block.forEach(b => gen(b))
      output.push(`}`)
      if (s.elifstatement.length > 0) {
        s.elifstatement.forEach(statement => gen(statement))
      }
      if (s.elsestatement.length > 0) {
        s.elsestatement.forEach(statement => gen(statement))
      }
    },
    Elif(s){
      output.push(`else if (${gen(s.condition)}) {`)
      s.block.forEach(b => gen(b))
      output.push(`}`)
    },
    Else(s) {
      output.push(`else {`)
      //Something is wrong with the else statements because they are embedded blocks VVV (unless the test is wrong)
      s.block.block.forEach(b => gen(b))
      output.push(`}`)
    },
    Assign(a) {
      if (a.target.constructor.name === `ClassAttr`) {
        output.push(`${a.target.source.id}.${a.target.method.id} = ${gen(a.source)}`)
      }
      else {
        output.push(`let ${gen(a.target)} = ${gen(a.source)}`)
      }
    },
    Print(p) {
      //output.push(`console.log(${JSON.stringify(p.argument.id)})`)
      output.push(`console.log(${gen(p.argument)})`)
    },
    ClassCall(c) {
      return (`new ${c.id.id}(${gen(c.args[0])})`)
    },
    FuncCall(f) {
      return (`${f.id.id}(${gen(f.args[0])})`)
    },
    Args(a) {
      const exps = []
      a.Exp.forEach(e => exps.push(e.id))
      return (`${exps.join(", ")}`)
      //a.Exp.forEach(arg => output.push(arg.id))
    },
    Return(r) {
      output.push(`return ${gen(r.value[0])}`)
    },
    /*
      Note: due to the fact that e.left and e.right can be their own binary / identifier expressions in our language
      the format of a binary expression is: ((e.left) op (e.right)) ie. ((x+1) > (y+1))
      when used in if statements and loops the code is generated with an excess of parenthesis just to be safe 
    */
    BinaryExp(e) {
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
      return `((${gen(e.left)}) ${op} (${gen(e.right)}))`
      //return( `(${e.left.id} ${op} ${e.right.id})`)
    },
    IdentifierExpression(e) {
      return `${e.id}`
    },
  }

  gen(program)
  return output.join("\n")
}