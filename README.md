# ts-wasmify

[WIP] Ahead of time compilation of methods in Typescript

## Installation
Please note that you need to have emscripten installed and in path. To verify use: `em++ -v`.


```
npm i ts-wasmify
```
And for linting use:
```
npm i eslint-plugin-ts-wasmify
```
Add ts-wasmify plugin to eslint and set project property in .eslintrc.json:

```
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "ts-wasmify"],
  "rules": {
    "ts-wasmify/ts-wasmify": ["warn"]
  }
}
```

## Usage

Write a file with aot decorator

```
import aot, { Int, Float, CArray, loadModule } from 'ts-wasmify';

const Module = loadModule(require('./compiled.js'));

class Myclass {
  @aot(Module)
  handleMax(a: CArray<Float>, n: Int): Float {
    let max = a.get(new Int(0));
    let i = new Int(0);
    while (i.lt(n)) {
      if(a.get(i).gt(max)) {
        max = a.get(i);
      }
      i = i.add(new Int(1));
    }
    return max;
  }
}

function main() {
  const obj = new Myclass();
  const floats = Module.createFloatArray();
  floats.push(new Float(-3.0));
  floats.push(new Float(1.0));
  floats.push(new Float(-5.0));

  console.log(obj.handleMax(floats, floats.size()));
}

Module.onLoad(() => main());
```


Compile

```
ts-wasmify
```