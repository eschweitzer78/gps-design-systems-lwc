# Newport Loader

The _Newport Loader_ is a utility that exposes a single `load` function used to ensure the Newport CSS styles load in the `<head>` of the page.

This utility:

- Ensures the styles are loaded only once across the page
- Loads a custom version of Newport if the `newportZipUrl` has been configured in the org.

## Available Methods

### load(component)

You must always pass your component to the `load` function.

```js
    import { load } from `c/sfGpsDsOsrtNewportLoader`;

    ...

    export default class MyComponent extends LightningElement {


        connectedCallback() {
            // It's recommended to add the styles into the page
            // from your connectedCallback so they're not added
            // to the page before they're needed, but available
            // for when the component's `render` is called.
            load(this)
                .then(() => {
                    // newport styles added to page
                });
        }
    }

```
