# Prompt Lightning Web Component

The _Prompt Lightning Web Component_ displays simple content on a layer on top of the app. For example, use a prompt to confirm form submission or to direct the user to confirm a step in a process. Use the _Modal Lightning Web Component_ to modify data with forms and fields.

## Available _c-prompt_ Attributes

| Attribute | Value                     | Type   | Required | Description                              |
| --------- | ------------------------- | ------ | -------- | ---------------------------------------- |
| title     |                           | string | yes      | Adds the header title to the prompt.     |
| message   |                           | string | yes      | Adds the content to the prompt.          |
| theme     | slds, nds (Default: slds) | string |          | Sets the theme for the prompt component. |

### Example _c-prompt_ Component

```html
   <c-prompt
    theme="slds"
    title="Service Unavailable"
    message="Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
  quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing."
  ></c:prompt>
```

### Available Methods

**openPrompt()**

If hidden, displays the prompt.

**closePrompt()**

If visible, hides the prompt.
