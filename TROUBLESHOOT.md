# Troubleshoot

In this document, we will go through typical ways to troubleshoot issues &mdash; bear in mind that this is work in progress and that we'll add content as we go.

## OmniStudio releases and changes in OmniScript element behaviour

The Salesforce platform features three releases a year and this also applies to the Omnistudio capability. On top of this, the Omnistudio team has recently
changed the way its managed package is distributed: from being on demand updates fully controlled by customers, updates are now pushed.

While platform upgrades are planned with a clear calendar when you could spin a preview sandbox and perform regression tests, automated updates of a
given version can lead to a number of issues, including unexpected changes. This is particularly true when it comes to the behaviour of OmniScript UI elements:
OmniStudio developers may not always keep in mind that customers out there do override Omniscript element templates and, as a result, they may perform changes
that seem harmless as they are consistently done both in the new release's template and javascript code for a given element's LWC.

When both are rolled out at the same time, it's not an issue as the developer controls both ends. But when an override has been put in place, you could
end up with a template that's in the style of the former releases' with javascript from the new release -- it can then become problematic and "breaking" if the
updated javascript does not make provisions to be backward compatible.

As an illustration, we had an issue with OmniStudio 248 when one of the elements (`combobox`) moved from having an event handler on `mouseup` (in 246) to having
in on `click` while specifically testing for the event type in the handler's javascript and not making a provision for backward compatibility. As a result, the
element override just ceased working and the dropdown would not open when clicking on the combobox field.

Our remedial work involved spotting the discrepency and adjusting the override template to add the new event type.

With element templates no longer being publicly documented, troubleshooting by looking into discrepencies has become a little trickier and you'll need to inspect
the code for the offending element's LWC directly in the browser's developer console. Both the template, css, and javascript of an LWC in source code get transpiled
into a single javascript file for deployment: as a result, the template gets harder to decypher as it's now a bunch of javascript.

You'll want to have
[Lightning Components Debug Mode](https://help.salesforce.com/s/articleView?id=sf.aura_debug_mode.htm&language=en_US&type=5) enabled in Setup for your Salesforce user when troubleshooting.

Let us use the OmniScript `combobox` element as an example.

Our overridden template based on 246 was as follows
(refer to [sfGpsDsAuNswComboboxOsN](./sfGpsDsAuNsw/main/default/lwc/sfGpsDsAuNswComoboxOsN)):

```
[...]
<div class="sfgpsds-combobox__form-element" role="none">
  <input
    class="nsw-form__input sfgpsds-combobox__input combobox"
    aria-describedby={computedAriaDescribedBy}
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="combobox-list"
    role="combobox"
    data-value={valueMap}
    type={type}
    disabled={disabled}
    required={required}
    placeholder={placeholder}
    tabindex={tabIndex}
    readonly={isNotInput}
    autocomplete="off"
    id="comboboxId"
    aria-activedescendant={activeDescendant}
    aria-invalid={sfGpsDsIsError}
    value={valueCopy}
    onblur={showLookup}
    onmouseup={showLookup}
    onkeydown={preventKeyDown}
    onkeyup={handleKeyUp}
  />
</div>
[...]
```

whereas the original product's template in 248 is as follows as spotted in the browser's developer console while using the OmniScript editor, refer
to `lightning/cmp/modules/omnistudio/combobox.js` in your browser's Sources tab. The template of an LWC is constructed in the earlier part of the javascript
code while methods etc are towards the bottom:

```
[...]
api_element("input", {
  classMap: stc10$1,
  attrs: {
    "aria-describedby": api_scoped_id("errorMessageBlock"),
    "aria-expanded": $cmp.isOpen,
    "aria-haspopup": "listbox",
    "aria-controls": api_scoped_id("combobox-list"),
    "role": "combobox",
    "data-value": $cmp.valueMap,
    "type": $cmp.type,
    "aria-disabled": $cmp.disabled,
    "required": $cmp.required ? "" : null,
    "placeholder": $cmp.placeholder,
    "tabindex": api_tab_index($cmp.tabIndex),
    "readonly": $cmp.isNotInput ? "" : null,
    "aria-readonly": $cmp.isNotInput,
    "autocomplete": "off",
    "id": api_scoped_id("comboboxId"),
    "aria-activedescendant": api_scoped_id($cmp.activeDescendant),
    "aria-invalid": $cmp.isError
  },
  props: {
    "value": $cmp.valueCopy
  },
  key: 11,
  on: {
    "blur": _m0 || ($ctx._m0 = api_bind($cmp.showLookup)),
    "click": _m1 || ($ctx._m1 = api_bind($cmp.showLookup)),
    "keydown": _m2 || ($ctx._m2 = api_bind($cmp.preventKeyDown)),
    "keyup": _m3 || ($ctx._m3 = api_bind($cmp.handleKeyUp))
  }
})
[...]
```

with the `showLookup` method being as follows:

```
showLookup(event) {
  if (this._readOnly && !this._alwaysShowLookup || this.disabled) {
    return;
  }
  if (event.type === "click") {
    this.highlightIndex = this.selectedOptionMap ? this.selectedOptionMap.optId : 0;
    this.setAriaAttributes(this.highlightIndex);
  }
  if (event.type === "click" || event.type === "keyup") {
    this.template.querySelector(`.${this.theme}-dropdown-trigger_click`).classList.toggle(`${this.theme}-is-open`);
    this.isOpen = this.template.querySelector(`.${this.theme}-dropdown-trigger_click`).classList.contains(`${this.theme}-is-open`);
[...]
```

It became apparent that the test on the event type used to read like `event.type === "mouseup"` in OmniStudio 246. As a result, because the
overridden template only triggers `showLookup` on `mouseup` while it's only executing the right business logic if the event type is
`click` (even though it should ideally honour the `mouseup` event to be backward compatible with the former version's template style),
the dropdown is never shown.

In that instance, we established that adding `click` on the overridden template on top of `mousedown` was the way to go: OmniStudio v246
would honour the `mousedown` event and discard the `click` event (as it's not part of business logic in 246) whereas Omnistudio v248
would honour the `click` event and discard the `mousedown` one.
