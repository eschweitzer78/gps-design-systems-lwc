# Modal Lightning Web Component

The _Modal Lightning Web Component_ displays content in a layer on top of the app. Common use cases for modals include: creating or editing a record, as well as various types of messaging and wizards. Use the _Prompt Lightning Web Component_ for form submission confirmation.

## Available _c-sf-gps-ds-osrt-modal_ Attributes

| Attribute          | Value                                     | Type    | Required | Description                                                                                                                      |
| ------------------ | ----------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| title              |                                           | string  |          | Adds the header title to the modal component.                                                                                    |
| size               | small, medium, large                      | string  |          | Sets the modal size. If not set, component takes the default size of the chosen _theme_.                                         |
| theme              | slds, nds (Default: slds)                 | string  |          | Sets the theme for this component.                                                                                               |
| isModalOpen        | true, false (Default: false)              | boolean |          | To show the modal by default, set to true.                                                                                       |
| hideheader         | no value (See example code.)              | string  |          | Hides the header from the modal.                                                                                                 |
| hidefooter         | no value (See example code.)              | string  |          | Hides the footer from the modal.                                                                                                 |
| extraclass         |                                           | string  |          | Adds a class to the container element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| height             | CSS (Default: calc(100vh - 160px))        | string  |          | Sets the height of the modal. Supports all CSS value types, such as calc, px, %, vh, and so on.                                  |
| min-height         | CSS (If _height_ is set this won't apply) | string  |          | Sets the minimum height of the modal. Supports all CSS value types, such as calc, px, %, vh, and so on.                          |
| max-height         | CSS (If _height_ is set this won't apply) | string  |          | Sets the maximum height of the modal. Supports all CSS value types, such as calc, px, %, vh, and so on.                          |
| modalBackdropStyle | CSS                                       | string  |          | Sets the custom backdrop style.                                                                                                  |
| channelName        |                                           | string  |          | Specify the channel name for closing the modal on pubsub event.                                                                  |

### Example _c-sf-gps-ds-osrt-modal_ Component

```html
<c-sf-gps-ds-osrt-modal
  title="Profile Info"
  size="large"
  isModalOpen
  hideheader
  hidefooter
>
  <div slot="header">
    <h1>Header description</h1>
  </div>
  <div slot="content">
    <c-vlocity_input
      value=""
      label="Name"
      placeholder="Enter Name"
    ></c-vlocity_input>
  </div>
  <div slot="footer">
    <c-vlocity_button variant="brand" label="Save"></c-vlocity_button>
  </div>
</c-sf-gps-ds-osrt-modal>
<button onclick="{openModal}" class="test">Open Modal</button>
```

### Available Methods

**openModal()**

If hidden, shows the modal.

**closeModal()**

If visible, hides the modal.
