# Omniscript Modal (omniscriptModal)

The Omniscript Modal component provides functionality for the modal displayed for Omniscript. This README will provide high-level information regarding the different properties and methods utilized by the Omniscript Modal LWC component.

### Properties

The following are a list of properties that are declared inside of the Omniscript Modal.

| Name            | Scope        | Description                                                                            |
| --------------- | ------------ | -------------------------------------------------------------------------------------- |
| type            | public (api) | Reactive public property. Identifies if the modal is a success or an error.            |
| hideHeader      | public (api) | Reactive public property. Identifies if the header of the modal is to be hidden.       |
| HideFooter      | public (api) | Reactive public property. Identifies if the footer of the modal is to be hidden.       |
| layout          | public (api) | Reactive public property. Determines which LWC player to use - lightning or newport.   |
| triggeredOnStep | public (api) | Reactive public property. Indicator if modal is triggered on step or in between steps. |

### Methods

The following are a list of methods that are declared inside of the Omniscript Modal.

| Signature           | Scope        | Return Value | Description                                                                             |
| ------------------- | ------------ | ------------ | --------------------------------------------------------------------------------------- |
| closeModal()        | api (public) | void         | Closes the modal.                                                                       |
| openModal()         | api (public) | void         | Opens the modal.                                                                        |
| connectedCallback() | private      | void         | Overwrite of the native LWC connectedCallback. Applies modal styles depending on theme. |
| render()            | private      | template     | Overwrites native LWC render                                                            |

### HTML Markup

The Omniscript Modal has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-modal
  data-omni-key="omnimodal"
  type="{type}"
  layout="{layout}"
  triggered-on-step="{triggeredOnStep}"
  hide-footer="{hideFooter}"
  hide-header="{hideHeader}"
>
</c-omniscript-modal>
```

### Attributes

**type** --- string attribute which identifies the type of modal: success or error

**dataOmniKey** --- element unique identifier

**layout** --- `newport` or `lightning`

**triggeredOnStep** --- boolean attribute which identifies if the modal is triggered on step (true) or in between steps (false).

**hideFooter** --- boolean attribute which identifies if the modal footer is to be be hidden

**hideFooter** --- boolean attribute which identifies if the modal header is to be be hidden
