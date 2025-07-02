# Coding Guidelines

This section describe the coding guidelines applying to any part of the project.

"Fishes VS Crabeez" is mainly written in Typescript for both the backend and the frontend.

> [!WARNING]
> Currently the above statement is false as the backend is still written in JS.  
> But we are in the process of migrating to a 100% TS codebase.

Therefore, this section will only revolves around TypeScript.  

If there is any exceptions to those guidelines in a part of the codebase, namely the backend or the frontend, they are described in their respective section of the guidelines.  
See :
- [Frontend Coding Guidelines](./coding-guidelines.frontend.md)
- [Backend Coding Guidelines](./coding-guidelines.backend.md)



<br><br>
--------------------------------------------------------------------------------
<br><br>



## Naming convention

Our naming convention is mainly inspired by the TypeScript's naming convention with a slight JavaScript flavour :

|Kind                     |Casing                |
|:------------------------|:---------------------|
|variable                 |**`camelCase`**       |
|constant                 |**`UPPER_SNAKE_CASE`**|
|                         |                      |
|function                 |**`camelCase`**       |
|method                   |**`camelCase`**       |
|                         |                      |
|type                     |**`PascalCase`**      |
|class                    |**`PascalCase`**      |
|interface                |**`PascalCase`**      |
|enum                     |**`PascalCase`**      |
|namespace                |**`PascalCase`**      |

Moreover, even though the TS naming convention advise against prefixing private and protected class members by a `_`, we still decide to do so for the following reasons :
- it's used in many naming conventions of which the [JavaScript Naming Convention](https://www.syncfusion.com/blogs/post/top-javascript-naming-convention)
- it facilitates adding `property` e.g :
    ```ts
    class MyClass {
        private _member;

        public get member() {
            return this._member;
        }
    }
    ```

> [!NOTE]
> The [Google's TypeScript Convention](https://google.github.io/styleguide/tsguide.html)
> proposes to prefix private members accessed via a property with `wrapped` or `internal`
> (see [link](https://google.github.io/styleguide/tsguide.html#class-members)).
> But we decided against it.



<br><br>
--------------------------------------------------------------------------------
<br><br>



## Do Not Use

While TypeScript proposes many good features, some of which aren't.  
In "Fishes VS Crabeez", we strongly discourage the use of the following features.  
Most of these are considered outdated, unsafe, or have superior alternatives.

> [!WARNING]
> Some of these restrictions will later be enforced using `tsconfig.json` and linters.

### 1 - Mixing CommonJS and ES

Avoid mixing CommonJS `require()` with ES `import`.  
In fact, you should avoid CommonJS unless **absolutely necessary**.

#### Reason why :
- Leads to bugs in module systems.

### 2 - `enum`
<table>
<tr><th> <h3>🔴 Bad</h3> </th><th> <h3>🟢 Good</h3> </th></tr>
<tr><td>

```ts
enum Color {
    Red,
    Green,
    Blue,s
}
```

</td><td>

```ts
const Color = {
    Red: 'Red',
    Green: 'Green',
    Blue: 'Blue',
} as const;
type Color = typeof Color[keyof typeof Color];
```

</td></tr>
</table>

#### Reason why :
- They generate JavaScript code
- Numerical `enum`s aren't type safe
- String `enum`s are nominal even though every other TS types are structural
- They are not always interoperable with other tools e.g Babel

### 3 - `any`

Avoid using `any` unless **absolutely necessary** such as when calling unsafe external APIs.

<table>
<tr><th> <h3>🔴 Bad</h3> </th><th> <h3>🟢 Good</h3> </th></tr>
<tr><td>

```ts
let data: any;
```

</td><td>

```ts
let data: unknown;
```

</td></tr>
</table>

#### Reason why :
- It disables type checking and erodes type safety

### 4 - `Function` (as a type)

Never use the generic `Function` type as a type.

<table>
<tr><th> <h3>🔴 Bad</h3> </th><th> <h3>🟢 Good</h3> </th></tr>
<tr><td>

```ts
let callback: Function;
```

</td><td>

```ts
let callback: (arg: unknown) => unknown;
```

</td></tr>
</table>

#### Reason why :
- It's too permissive
- It provides no safety for arguments or return types as those are considered to be of type `any`

> [!NOTE]
> You can however use it in the codebase to check whether an `unknown` value is callable.
>
> For example :
> ```ts
> let f: unknown = () => {
>     console.log("Has been successfully called");
> };
> ```
> `f` is definitely callable but because its type is `unknown`, TS won't allow us to call `f`.  
> To call `f` we need to assert/check that `f` is callable :
> ```ts
> if (f instanceof Function) {
>     f();
> }
>
> // Or
>
> assert(f instanceof Function);
> f();
> ```

### 5 - Triple-slash directives (`/// <reference ...>`)

<table>
<tr><th> <h3>🔴 Bad</h3> </th><th> <h3>🟢 Good</h3> </th></tr>
<tr><td>

```ts
/// <reference lib="es6" />
/// <reference types="node" />

/// <reference path="./utils.ts" />


// Some TS code ...
```
&nbsp;<br/>
&nbsp;<br/>
&nbsp;<br/>
&nbsp;<br/>

</td><td>

```ts
import { helperFn } from './utils';
```

In `tsconfig.json` :
```json
{
  "compilerOptions": {
    // ...
    "types": ["node"],
    "lib": ["es6"]
  }
}
```

</td></tr>
</table>

#### Reason why :
- These are not needed in modern TypeScript
- They can introduce resolution and tooling issues.
