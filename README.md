# quotecodequote
<img src="https://github.com/kmarinsh/quotecodequote/blob/main/qcqlogo.jpg?raw=true" alt="drawing" width="200"/>


quotecodequote is a programming language making psuedocode functional
## Introduction
Have you ever found yourself skimming the Wikipedia article for Bogosort and had trouble implementing the pseudocode in your language of choice? Look no further, as quotecodequote is the language for you! Verbose in nature, quotecodequote is meant to be easily readable at first glance and accessible to all.

## Features
* Dynamically typed vairables
* No semicolon at end of line
* .qcq file extension
* Straightforward variable assignment
* Easy to read and understand

## Examples
```
Javascript                                  quotecodequote
```
Operators
```
x = 5                                                       x is 5 (for assignment)
x + 5                                                       x + 5
x - 5                                                       x - 5 
x * 5                                                       x * 5
x / 5                                                       x / 5
x ** 5                                                      x ^ 5
x % 7                                                       x % 7
```

Comparators
```
x && y                                                      x and y
x || y                                                      x or y
x < y                                                       x < y
x > y                                                       x > y
x <= y                                                      x <= y
x >= y                                                      x >= y
x === y                                                     x == y
x !== y                                                     x != y
```

Print
```
console.log(x)                                              output x
```

Conditionals
```
if (x == 0) {                                               if x == 0
    console.log("False")                                        output “False”
} else if (x == 1){                                         else if x == 1
    console.log("True")                                         output “True”
} else {                                                    else
    console.log("Maybe?")                                       output "Maybe?"
}
```

For Loop
```
for (let i = 0; i < 10; i++){                               loop i from 0 to 10 by 1
    console.log(i)                                              output i
}                                                           end
```

While Loop
```
while (i != 10) {                                           loop until i != 10
    console.log(5 * i)                                          output 5 * i
}                                                           end
```

Hello World
```
console.log("hello world")                                  output "hello world"
```

Functions
```
function average(x, y){                                     function average in: x, y
    let sum = x * y                                             sum is x + y
    return sum / 2                                              out: sum / 2
}  

function twoSum(nums, target) {                             function twoSum in: nums, target
    if (nums.length === 2) {                                    if length(nums) == 2
        return [0, 1]                                               out: [0,1]
    }                                                           ans is list
    let ans = []                                                hashtable is map
    let hashTable = {}                                          loop i from 0 to length(nums) by 1
    for (let i = 0; i < nums.length; i++) {                         complement is target-nums[i]
        let complement = target - nums[i]                           find is hashtable[complement]
        let find = hashTable[complement]                            if find != undefined
        if (find !== undefined) {                                       ans is list[find,i]
            ans = [find, i]                                      end
            break                                                   hashtable[nums[i]] is i
        }                                                        out: ans
        hashTable[nums[i]] = i
    }
    return ans
}

function largestNum(x, y, z){                               function largestNum in: x, y, z
    if (x >= y && x >= z) {                                     if x >= y and x >= z
        return x                                                    out: x
    } else if (y >= x && y >= z) {                              else if y >= x and y >= z
        return y                                                    out: y
    } else {                                                    else
        return x                                                    out: x
    }

function factorial(x){                                      function factorial in: x
    if (x == 0 || x == 1) {                                     if x == 0 or x == 1
        return x                                                    out: x
    } else {                                                    else
        return x * factoral(x-1)                                    out: x * factoral(x-1)
    }
}
