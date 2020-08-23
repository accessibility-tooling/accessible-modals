# Accessible Modals

JS for quickly making any modals accessibility friendly. The script adds a new property on the window called `a11yModal` 
exposing several methods for managing modal dialogs.

For information on the accessibility of modals visit [here](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html).

## Interactive Demo

Checkout the interactive [demo](https://accessibility-tooling.github.io/accessible-modals/demo) here.

## Modal Hierarchy

- Modal Layer
  - Modal Container
    - Modal
  - Modal Container
    - Modal
  - Modal Container
    - Modal

## Getting Started 

### Step 1 - Add a root modal layer

Any modals you wish to display should be placed within this modal layer. Multiple modals and nested modals
are supported.

```html
<div class="a11y-modal-layer a11y-hidden">
  // Modal containers go here.
</div>
```

### Step 2 - Add a modal container to the root layer

Now with your root layer configured you can add a modal container to the root layer. Whether you are implemented 
multiple independent modals or a series of nested modals ALL modal containers are placed in the root of the 
modal layer.

```html
<div class="a11y-modal-container">
  <div class="a11y-modal" id="accessible-demo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="a11y-modal-banner">
      <h1 class="a11y-modal-title" id="modal-title">Modal Title</h1>
    </div>
    <div class="a11y-modal-content">
      ...
    </div>
    <div class="a11y-modal-footer">
      <button type="button" class="a11y-modal-dismiss">Cancel</button>
    </div>
  </div>
</div>
```

In order to proper implement acessible modals you need to ensure you properly indicate that your modal is fulfilling 
the dialog role. The `a11y-modal-container` contains an element with the class `a11y-modal` which is marked with the requisit
html attributes to indicate its intending purpose as a dialog element. You can see the following attributes are applied.

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="[INSERT MODAL TITLE ID]"`

Of the three attributes above only `aria-labelledby` needs to be configured per modal. The modal markup contains an `h1` element
with and id of `a11y-modal-title` continuing are example the `aria-labelledby` attribute for our example modal would be set
to `a11y-modal-title`.

## Nested Modals

If you want to open modals from within other modals you simply have to add your nested modals markup to the root
of the modal layer then either programmatically open it using `window.a11yModa.open(id)` or add
a button toggle to the markup of another modal. If a modal is already open when `open` is called for this new modal 
if will automatically open in front of the already opened modal and trap focus in the new modal.

For example if using the markup from our getting started guide all you need to do is simply
modify the modal footer to the following markup.

```html
<div class="a11y-modal-footer">
  <button type="button" class="modal-toggle" data-target="accessible-demo-modal-sub">Open Sub Modal</button>
  <button type="button" class="a11y-modal-dismiss">Cancel</button>
</div>
```

Now the user has the option to either dismiss the first modal or open up the nested modal. You can freely continue to nest modals more deeply
as focus will automatically be trapped to the new open modal instance and then promptly returned to the preceding instance once the nested
modal is dismissed.

## Modal Manager

| Method    | Parameters                   | Description  |
|-----------|------------------------------|---|
| configure | modalIdentifier      | Creates a new modal instance if an instance exists nothing is done |
| open      | modalIdentifier      | Opens the specified modal within the modal layer |
| close     | modalInstance | Closes the specified modal within the modal layer |
