import assert from "assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
//import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
    {
        name: "Hello World",
        source: `output "hello, world!"`,
        expected: `console.log("hello, world!")`,
    },
    {
        name: "basic if statements",
        source: `if 2 < 3 output 5 end`,
        expected: dedent`
        if (2 < 3) {
        console.log(5)
        }`
    },
    {
        name:"if ifelse else",
        source: `if 2 < 3 output 3 end elif x>5 output 2 end else output 1 end `,
        expected: dedent`
        if (2 < 3) {
        console.log(3)
        }
        else if (x > 5) {
        console.log(2)
        }
        else {
        console.log(1)
      }`
    },
    // {
    //     name:"if ifelse else",
    //     source: `if 2 < 3 output 3 end elif x>5 output 2 end elif x<8 output 8 end else output 1 end `,
    //     expected: `if(2<3){console.log(3)} else if(x>5){console.log(2)} else if {console.log(8)} else{console.log(1)}} `
    // },
//     name: "if",
//     source: `
//       let x = 0;
//       if (x == 0) { print("1"); }
//       if (x == 0) { print(1); } else { print(2); }
//       if (x == 0) { print(1); } else if (x == 2) { print(3); }
//       if (x == 0) { print(1); } else if (x == 2) { print(3); } else { print(4); }
//     `,
//     expected: dedent`
//       let x_1 = 0;
//       if ((x_1 === 0)) {
//         console.log("1");
//       }
//       if ((x_1 === 0)) {
//         console.log(1);
//       } else {
//         console.log(2);
//       }
//       if ((x_1 === 0)) {
//         console.log(1);
//       } else {
//         if ((x_1 === 2)) {
//           console.log(3);
//         }
//       }
//       if ((x_1 === 0)) {
//         console.log(1);
//       } else
//         if ((x_1 === 2)) {
//           console.log(3);
//         } else {
//           console.log(4);
//         }
//     `,
//   },
//   {
//     name: "while",
//     source: `
//       let x = 0;
//       while x < 5 {
//         let y = 0;
//         while y < 5 {
//           print(x * y);
//           y = y + 1;
//           break;
//         }
//         x = x + 1;
//       }
//     `,
//     expected: dedent`
//       let x_1 = 0;
//       while ((x_1 < 5)) {
//         let y_2 = 0;
//         while ((y_2 < 5)) {
//           console.log((x_1 * y_2));
//           y_2 = (y_2 + 1);
//           break;
//         }
//         x_1 = (x_1 + 1);
//       }
//     `,
//   },
//   {
//     name: "functions",
//     source: `
//       let z = 0.5;
//       function f(x: float, y: boolean) {
//         print(sin(x) > π);
//         return;
//       }
//       function g(): boolean {
//         return false;
//       }
//       f(z, g());
//     `,
//     expected: dedent`
//       let z_1 = 0.5;
//       function f_2(x_3, y_4) {
//         console.log((Math.sin(x_3) > Math.PI));
//         return;
//       }
//       function g_5() {
//         return false;
//       }
//       f_2(z_1, g_5());
//     `,
//   },
//   {
//     name: "arrays",
//     source: `
//       let a = [true, false, true];
//       let b = [10, 40 - 20, 30];
//       const c = [](of [int]);
//       print(a[1] || (b[0] < 88 ? false : true));
//     `,
//     expected: dedent`
//       let a_1 = [true,false,true];
//       let b_2 = [10,20,30];
//       let c_3 = [];
//       console.log((a_1[1] || (((b_2[0] < 88)) ? (false) : (true))));
//     `,
//   },
//   {
//     name: "structs",
//     source: `
//       struct S { x: int }
//       let x = S(3);
//       print(x.x);
//     `,
//     expected: dedent`
//       class S_1 {
//       constructor(x_2) {
//       this["x_2"] = x_2;
//       }
//       }
//       let x_3 = new S_1(3);
//       console.log((x_3["x_2"]));
//     `,
//   },
//   {
//     name: "optionals",
//     source: `
//       let x = no int;
//       let y = x ?? 2;
//     `,
//     expected: dedent`
//       let x_1 = undefined;
//       let y_2 = (x_1 ?? 2);
//     `,
//   },
//   {
//     name: "for loops",
//     source: `
//       for i in 1..<50 {
//         print(i);
//       }
//       for j in [10, 20, 30] {
//         print(j);
//       }
//       repeat 3 {
//         // hello
//       }
//       for k in 1...10 {
//       }
//     `,
//     expected: dedent`
//       for (let i_1 = 1; i_1 < 50; i_1++) {
//         console.log(i_1);
//       }
//       for (let j_2 of [10,20,30]) {
//         console.log(j_2);
//       }
//       for (let i_3 = 0; i_3 < 3; i_3++) {
//       }
//       for (let k_4 = 1; k_4 <= 10; k_4++) {
//       }
//     `,
//   },
//   {
//     name: "standard library",
//     source: `
//       let x = 0.5;
//       print(sin(x) - cos(x) + exp(x) * ln(x) / hypot(2.3, x));
//       print(bytes("∞§¶•"));
//       print(codepoints("💪🏽💪🏽🖖👩🏾💁🏽‍♀️"));
//     `,
//     expected: dedent`
//       let x_1 = 0.5;
//       console.log(((Math.sin(x_1) - Math.cos(x_1)) + ((Math.exp(x_1) * Math.log(x_1)) / Math.hypot(2.3,x_1))));
//       console.log([...Buffer.from("∞§¶•", "utf8")]);
//       console.log([...("💪🏽💪🏽🖖👩🏾💁🏽‍♀️")].map(s=>s.codePointAt(0)));
//     `,
//   },

    /*
      qcq
      class Point has x and y
        method of a and b is 
          out a*b
        end 
      end
      js
      Class Point{
        constructor(x_1,y_2){
          this.x_1=x_1
          this.y_2=y_2
        }

        method(a,b) {
            return a*b
        }
      }
        qcq
        p is new Point with x as 3 and y as 2
        output p:method with a as 1 and b as 2
        output p:x

        js
        let p=new Point(3,2)
        console.log(p.method())
        console.log(p.x)

        qcq
        loop x from 20 to 1 by -2 
          output x
        end
        abs(x-final)<=increment

        js
        for(let x=20;x>=1;x=x + -2){
          console.log(x)
        }
       
        qcq 
        p is new Point with x as 10 and y as 10
        js
        const p = new Point(10,10)
      */
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(analyze(parse(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})