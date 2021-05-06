import * as ast from "./ast.js"

export default function optimize(node) {
    return optimizers[node.constructor.name](node)
}

const optimizers = {
    Program(p) {
        for (let i = 0; i < p.blocks.length; i++) {
            p.blocks[i] = optimize(p.blocks[i])
        }
        //p.blocks = optimize(p.blocks)
        return p
    },
    Block(b) {       
        for (let i = 0; i < b.statements.length; i++) {
            b.statements[i] = optimize(b.statements[i])
            if (b.statements[i].constructor.name == "Return") {
                b.statements = b.statements.slice(0, i+1)
                return b
            }
        }
        return b
    },
    Class(c){
        for (let i=0; i<c.fields.length; i++) {
            if (c.fields[i].constructor.name == "BinaryExp") {
                c.fields[i] = optimize(c.fields[i])
            }
        }
        for (let i = 0; i < c.methods.length; i++) {
            c.methods[i] = optimize(c.methods[i])
            // if (c.methods[i].constructor.name == "Return") {
            //     c.methods = c.methods.slice(0, i+1)
            //     return c
            // }
        }
        return c
    },
    Field(f){
        for (let i=0; i<f.fields.length; i++) {
            if (f.fields[i].constructor.name == "BinaryExp") {
                f.fields[i] = optimize(f.fields[i])
            }
        }
        return f
    },
    Method(m){
        for (let i = 0; i < m.params.length; i++) {
            m.params[i] = optimize(m.params[i])
        }
        for (let i = 0; i < m.block.length; i++) {
            m.block[i] = optimize(m.block[i])
            // if (m.block[i].constructor.name == "Return") {
            //     m.block = m.block.slice(0, i+1)
            //     return m
            // }
        }
        return m
    },
    ClassAttr(a){
        for (let i =0; i < a.params.length; i++){
            if (a.params[i].constructor.name == "BinaryExp"){
                a.params[i] = optimize(a.params[i])
            }
        }
        return a
    },
    Function(f) {
        for (let i = 0; i < f.params.length; i++) {
            if (f.params[i].constructor.name == "BinaryExp"){
                f.params[i] = optimize(f.params[i])
            }
        }
        for (let i = 0; i < f.block.length; i++) {
            f.block[i] = optimize(f.block[i])
            if (f.block[i].constructor.name == "Return") {
                f.block = f.block.slice(0, i+1)
                return f
            }
        }
        if (f.block.length === undefined){
            f.block = optimize(f.block)
        }
        return f
    },
    Params(p){
        for (let i=0; i<p.factors.length; i++) {
            if (p.factors[i].constructor.name == "BinaryExp") {
                p.factors[i] = optimize(p.factors[i])
            }
        }
        // if (p.factors.length === undefined) {
        //     p.factors = optimize(p.factors)
        // }
        return p
    },
    While(s) {
        if (s.condition === false) {
            // while false is a no-op
            return []
        }
        if (s.condition.constructor.name == "BinaryExp") {
            s.condition = optimize(s.condition)
        }
        if (s.block.constructor.name == "Block"){
            s.block = optimize(s.block)
        } 
        else {
            for (let i = 0; i < s.block.length; i++) {
                s.block[i] = optimize(s.block[i])
                if (s.block[i].constructor.name == "Return") {
                    s.block = s.block.slice(0, i+1)
                    return s
                }
            }
        }
        
        return s
    },
    For(s) {
        //s.id = optimize(s.id)
        //s.initial = optimize(s.initial)
        //s.final = optimize(s.final)
        //s.increment = optimize(s.increment)
        if (s.increment < 0){
            if (s.initial < s.final) {
                return ""
            }
        }
        else {
            if (s.initial > s.final) {
                return ""
            }
        }
        for (let i=0; i < s.block.length; i++){
            s.block[i] = optimize(s.block[i])
        }
        return s
    },
    If(s) {
        if (s.condition.constructor.name == "BinaryExp"){
            s.condition = optimize(s.condition)
        }
        for (let i = 0; i < s.block.length; i++) {
            s.block[i] = optimize(s.block[i])
            if (s.block[i].constructor.name == "Return") {
                s.block = s.block.slice(0, i+1)
                return s
            }
        }
        // if (s.elifstatement !== null) {
        //     s.elifstatement = optimize(s.elifstatement)
        // }
        // if (s.elsestatement !== null) {
        //     s.elsestatement = optimize(s.elsestatement)
        // }
        // s.blocks = optimize(s.block)
        // s.elifstatement = optimize(s.elifstatement)
        // s.elsestatement = optimize(s.elsestatement)
        // if (s.test.constructor === Boolean) {
        //   return s.test ? s.consequent : s.alternate
        // }
        return s
    },
    Elif(s) {
        if (s.condition.constructor.name == "BinaryExp"){
            s.condition = optimize(s.condition)
        }
        for (let i = 0; i < s.block.length; i++) {
            s.block[i] = optimize(s.block[i])
            if (s.block[i].constructor.name == "Return") {
                s.block = s.block.slice(0, i+1)
                return s
            }
        }
        return s
    },
    Else(s) {
        for (let i = 0; i < s.block.block.length; i++) {
            s.block.block[i] = optimize(s.block.block[i])
            if (s.block.block[i].constructor.name == "Return") {
                s.block.block = s.block.block.slice(0, i+1)
                return s
            }
        }
        return s
    },
    Assign(a) {
        if (a.source.constructor.name == "BinaryExp"){
            a.source = optimize(a.source)
        }
        return a
    },
    Print(s){
        if (s.argument.constructor.name == "BinaryExp"){
            s.argument = optimize(s.argument)
        }
        return s
    },
    ClassCall(c){
        for (let i=0; i<c.args.length;i++){
            if (c.args[i].constructor.name == "BinaryExp"){
                c.args[i] = optimize(c.args[i])
            }
        }
        return c
    },
    FuncCall(c){
        for (let i = 0; i < c.args.length; i++) {
            c.args[i] = optimize(c.args[i])
        }
        return c
    },
    Args(a){
        for (let i =0; i < a.Exp.length; i++){
            if (a.Exp[i].constructor.name == "BinaryExp"){
                a.Exp[i] = optimize(a.Exp[i])
            }
        }
        return a
    },
    Return(s){
        if (s.value.constructor.name == "BinaryExp"){
            s.value = optimize(s.value)
        }
        return s
    },

    // Conditional(e) {
    //   e.test = optimize(e.test)
    //   e.consequent = optimize(e.consequent)
    //   e.alternate = optimize(e.alternate)
    //   if (e.test.constructor === Boolean) {
    //     return e.test ? e.consequent : e.alternate
    //   }
    //   return e
    // },
    BinaryExp(e) {
    //   e.left = optimize(e.left)
    //   e.right = optimize(e.right)
        if (e.op === "and") {
            // Optimize boolean constants in and and or
            if (e.left === true) return e.right
            else if (e.right === true) return e.left
            else if (e.left === false) return false
            else if (e.right === false) return false
        } else if (e.op === "or") {
            if (e.left === false) return e.right
            else if (e.right === false) return e.left
            else if (e.left === true) return true
            else if (e.right === true) return true
        }
        else if ([Number, BigInt].includes(e.left.constructor)) {
            // Numeric constant folding when left operand is constant
            if ([Number, BigInt].includes(e.right.constructor)) {
            if (e.op === "+") return e.left + e.right
            else if (e.op === "-") return e.left - e.right
            else if (e.op === "*") return e.left * e.right
            else if (e.op === "/") return e.left / e.right
            else if (e.op === "^") return e.left ** e.right
            else if (e.op === "<") return e.left < e.right
            else if (e.op === "<=") return e.left <= e.right
            else if (e.op === "==") return e.left === e.right
            else if (e.op === "!=") return e.left !== e.right
            else if (e.op === ">=") return e.left >= e.right
            else if (e.op === ">") return e.left > e.right
            } else if (e.left === 0 && e.op === "+") return e.right
            else if (e.left === 1 && e.op === "*") return e.right
            // else if (e.left === 0 && e.op === "-") return new ast.UnaryExpression("-", e.right)
            else if (e.left === 1 && e.op === "^") return 1
            else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0
        } else if (e.right.constructor === Number) {
            // Numeric constant folding when right operand is constant
            if (["+", "-"].includes(e.op) && e.right === 0) return e.left
            else if (["*", "/"].includes(e.op) && e.right === 1) return e.left
            else if (e.op === "*" && e.right === 0) return 0
            else if (e.op === "^" && e.right === 0) return 1
        }
        return e
    }
    // UnaryExpression(e) {
    //   e.operand = optimize(e.operand)
    //   if (e.operand.constructor === Number) {
    //     if (e.op === "-") {
    //       return -e.operand
    //     }
    //   }
    //   return e
    // },
    
    
    
  }