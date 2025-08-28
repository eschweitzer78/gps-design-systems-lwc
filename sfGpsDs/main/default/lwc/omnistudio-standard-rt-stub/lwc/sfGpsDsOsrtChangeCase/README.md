## ns/changeCase

This library module exports several utility functions to accommodate changing
the casing style of a given string. For example converting `my-component-name` to `myComponentName`
or the inverse. It also exposes a base generic `changeCase` function which empowers users to
create their own custom casing patterns.

- [ns/changeCase](#markdown-header-nschangecase)
  - [.changeCase(input, replacer, [separator])](#markdown-header-nschangecasechangecaseinput-replacer-separator-string) ⇒ string
  - [.camelCase(input)](#markdown-header-nschangecasecamelcaseinput-string) ⇒ string
  - [.kebabCase(input)](#markdown-header-nschangecasekebabcaseinput-string) ⇒ string
  - [.snakeCase(input)](#markdown-header-nschangecasesnakecaseinput-string) ⇒ string

### ns/changeCase.changeCase(input, replacer, [separator]) ⇒ string

Generic change case utility. Used to take a string with any or no particular casing pattern and normalize it.
Takes the input parameter and applies the replacer function to each part, joined with an optional separator.
Use this method to create custom case changes not provided by this component.

**Kind**: static method of [ns/changeCase](#markdown-header-nschangecase)

| Param       | Type     | Description                                                                                                                |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| input       | string   | A string to be converted from one casing to another.                                                                       |
| replacer    | function | A function applied to each part of the input. The function takes a part, and index parameter and should return a string[]. |
| [separator] | string   | A string to use as a separator between parts.                                                                              |

**Example**

```JS
// Convert to constant case:
changeCase('some-Example_Constant', (part) => part.toUpperCase(), '_')
// outputs SOME_EXAMPLE_CONSTANT
```

**Example**

```JS
// Convert to pascal case:
changeCase('some-Example_Constant', (part) =>  part.charAt(0).toUpperCase() + part.substring(1))
```

### ns/changeCase.camelCase(input) ⇒ string

Takes the given input and converts it to `camelCase`. Ideal for converting html or attribute names to their preferred JavaScript identifier casing.

**Kind**: static method of [ns/changeCase](#markdown-header-nschangecase)

| Param | Type   | Description                                              |
| ----- | ------ | -------------------------------------------------------- |
| input | string | A string to be converted from one casing to `camelCase`. |

### ns/changeCase.kebabCase(input) ⇒ string

Takes the given input and converts it to `kebab-case`. Ideal for converting camelCased JavaScript identifiers,
and converting them to their `tag-or-attribute` form.

**Kind**: static method of [ns/changeCase](#markdown-header-nschangecase)

| Param | Type   | Description                                               |
| ----- | ------ | --------------------------------------------------------- |
| input | string | A string to be converted from one casing to `kebab-case`. |

### ns/changeCase.snakeCase(input) ⇒ string

Takes the given input and converts it to `snake_case`.

**Kind**: static method of [ns/changeCase](#markdown-header-nschangecase)

| Param | Type   | Description                                               |
| ----- | ------ | --------------------------------------------------------- |
| input | string | A string to be converted from one casing to `snake_case`. |
