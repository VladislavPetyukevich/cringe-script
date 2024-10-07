# Cringe Script
Interpreted programming language.

## Installation and run
Run `npm install` or `npm ci` for install all dependencies.  
Run `npm run demo` for start development demo project.  

## Cringe concepts
* No Loops (Use Recursion)  
* No Ifs (Ternary Operator Allowed)  
* Function is a Single Return  
* No Side-Effects  
* No Assignments in Functions  
* No Arrays (Use List-like Objects)  
* Only Functions with 0 or 1 Arguments (Use Closures)  

## Syntrax
### Mathematical Expression
```
1 * (2 + 3)
```
### Assignment
```
foo = 'bar'
```
### Comment
```
// some comment
```
### Ternary If
```
ternaryIf = 6 > 9 ? 4 ? 20 : sum(88)(14) : 42
```
### Function Definition
```
sum = a => b => a + b
```
### Function Call
```
sum(6)(9)
```
### Object Definition
```
pair = {
  first: 69 + 69
  second: {
    first: sum(4)(20)
    second: 777
  }
}
```
### Cringe (JS Code injection)
Multiline:
```
~
console.log('count:', count);
console.log('countX2:', count2);
console.log('countX3:', count3);
~
```
One line:
```
~ console.log('ternaryIf:', ternaryIf); ~
```
