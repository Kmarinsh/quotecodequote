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
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name ?? entity.description}_${mapping.get(entity)}`
    }
  })(new Map())


  const gen = node => generators[node.constructor.name](node)
  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      p.blocks.forEach(block => gen(block))
    },
    Block(b){
      console.log(b)
      gen(b.statements)
    },
    Class(c){
      output.push(`Class ${gen(c.id)}{ constructor(${gen(c.fields).join(", ")}){`)
      c.fields.forEach(field => output.push(`this.${field.id} = ${field.id}}`))
      c.fields.forEach(field=> output.push(`get_${field.id}() { return this.${field.id}}`))
      gen(c.methods)
      output.push("}")
    },
    Field(f) {
      return targetName(f)
    },
    Method(m) {
      output.push(`${gen(m.id)}(${gen(d.params).join(", ")}) {`)
      gen(d.block)
      output.push("}")
    },
    ClassAttr(c) {
      if (c.params.length > 0){
        output.push(`${c.source.id}.${c.method}(${c.params.join(", ")})`)
      }
      else{
        output.push(`${c.source.id}.get_${c.method}()`)
      }
    },
    Function(d) {
      output.push(`function ${gen(d.id)}(${gen(d.params).join(", ")}) {`)
      gen(d.block)
      output.push("}")
    },
    Params(p) { 
      return targetName(p)
    },
    WhileStatement(s) {
      output.push(`while (${gen(s.condition)}) {`)
      gen(s.block)
      output.push("}")
    },
    For(s) {
      const i = targetName(s.iterator)
      const op = (s.increment > 0) ? `<=` : `>=`
      output.push(`for (let ${i} = ${s.initial}; ${i} ${op} ${gen(s.final)}; ${i} = ${i} + ${increment}) {`)
      gen(s.block)
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
        console.log(s.elsestatement)
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
      output.push(`let ${a.target} = ${a.source}`)
    },
    Print(p) {
      //output.push(`console.log(${JSON.stringify(p.argument.id)})`)
      output.push(`console.log(${p.argument.id})`)
    },
    ClassCall(c) {
      output.push(`new ${c.id}(${gen(d.args).join(", ")})`)
    },
    FuncCall(f) {
      outpush.push(`${f.id}(${gen(args).join(", ")})`)
    },
    Args(a) {
      a.forEach(arg => output.push(arg.Exp))
    },
    Return(r) {
      output.push(`return ${gen(r.value)}`)
    },
    BinaryExp(e) {

      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op

      return `${gen(e.left)} ${op} ${gen(e.right)}`
      //return( `(${e.left.id} ${op} ${e.right.id})`)
    },
    IdentifierExpression(e) {
      return `${e.id}`
    },
  }

  gen(program)
  return output.join("\n")
}