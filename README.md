# quotecodequote

<img src="https://github.com/kmarinsh/quotecodequote/blob/main/qcqlogo.jpg?raw=true" alt="drawing" width="200"/>

quotecodequote is a programming language making psuedocode functional

Website: https://kmarinsh.github.io/quotecodequote/

## Introduction

Have you ever found yourself skimming the Wikipedia article for Bogosort and had trouble implementing the pseudocode in your language of choice? Look no further, as quotecodequote is the language for you! Verbose in nature, quotecodequote is meant to be easily readable at first glance and accessible to all.

## Features

- Dynamically typed vairables
- No semicolon at end of line
- .qcq file extension
- Straightforward variable assignment
- Easy to read and understand

## Examples

```
Javascript                                          quotecodequote
```

Operators

```
x = 5                                               x is 5 (for assignment)
x + 5                                               x + 5
x - 5                                               x - 5
x * 5                                               x * 5
x / 5                                               x / 5
x ** 5                                              x ^ 5
x % 7                                               x % 7
```

Comparators

```
x && y                                              x and y
x || y                                              x or y
x < y                                               x < y
x > y                                               x > y
x <= y                                              x <= y
x >= y                                              x >= y
x === y                                             x == y
x !== y                                             x != y
```

Print

```
console.log(x)                                      output x
```

Conditionals

```
if (x == 0) {                                       if x == 0
    console.log("False")                                output “False”
} else if (x == 1){                                 end
    console.log("True")                             else if x == 1
} else {                                                output “True”                                                    
    console.log("Maybe?")                           end
}                                                   else
                                                        output "Maybe?"
                                                    end

```

For Loop

```
for (let i = 0; i < 10; i++){                       loop i from 0 to 10 by 1
    console.log(i)                                      output i
}                                                   end
```

While Loop

```
while (i != 10) {                                   loop until i != 10 output 5 * i end
    console.log(5 * i)                                  
}                                                   
```

Hello World

```
console.log("hello world")                          output "hello world"
```

Functions

```
function average(x, y){                             function average in: x, y
    let sum = x * y                                     sum is x + y
    return sum / 2                                      out: sum / 2
                                                    end
}



function twoSum(nums, target) {                     function twoSum in: nums, target
    if (nums.length === 2) {                            if length(nums) == 2
        return [0, 1]                                       out: [0,1]
     }                                                   end
     let ans = []                                        ans is list
     let hashTable = {}                                  hashtable is map
     for (let i = 0; i < nums.length; i++) {             loop i from 0 to length(nums) by 1
        let complement = target - nums[i]                    complement is target-nums[i]
        let find = hashTable[complement]                     find is hashtable[complement]
        if (find !== undefined) {                            if find != undefined
           ans = [find, i]                                      ans is list[find,i]
           break                                                break
        }                                                    end
         hashTable[nums[i]] = i                              hashtable[nums[i]] is i
     }                                                   end
     return ans                                          out: ans
}                                                    end
    


function largestNum(x, y, z){                       function largestNum in: x, y, z
    if (x >= y && x >= z) {                             if x >= y and x >= z
        return x                                            out: x
    } else if (y >= x && y >= z) {                      end
    return y                                            else if y >= x and y >= z
        } else {                                            out: y
             return z                                   end
    }                                                   else
}                                                           out: z
                                                        end
                                                    end
                                                    
                                                    

function factorial(x){                              function factorial in: x
    if (x == 0 || x == 1) {                             if x == 0 or x == 1
        return x                                            out: x
    } else {                                            end
        return x * factoral(x-1)                        else
    }                                                       out: x * call: factoral x-1
}                                                       end
                                                     end
    

```
