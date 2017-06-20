class XblMenulistEditable extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menulist-editable-box textbox-input-box" inherits="context,disabled,readonly,focused" flex="1">
<input class="menulist-editable-input" anonid="input" allowevents="true" inherits="value=label,value,disabled,tabindex,readonly,placeholder">
</input>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" inherits="open,disabled,parentfocused=focused">
</dropmarker>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist-editable");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get inputField() {
    if (!this.mInputField)
      this.mInputField = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "input"
      );
    return this.mInputField;
  }

  set label(val) {
    this.inputField.value = val;
    return val;
  }

  get label() {
    return this.inputField.value;
  }

  set value(val) {
    // Override menulist's value setter to refer to the inputField's value
    // (Allows using "menulist.value" instead of "menulist.inputField.value")
    this.inputField.value = val;
    this.setAttribute("value", val);
    this.setAttribute("label", val);
    this._selectInputFieldValueInList();
    return val;
  }

  get value() {
    return this.inputField.value;
  }

  set selectedItem(val) {
    var oldval = this.mSelectedInternal;
    if (oldval == val) return val;

    if (val && !this.contains(val)) return val;

    // This doesn't touch inputField.value or "value" and "label" attributes
    this.setSelectionInternal(val);
    if (val) {
      // Editable menulist uses "label" as its "value"
      var label = val.getAttribute("label");
      this.inputField.value = label;
      this.setAttribute("value", label);
      this.setAttribute("label", label);
    } else {
      this.inputField.value = "";
      this.removeAttribute("value");
      this.removeAttribute("label");
    }

    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);

    event = document.createEvent("Events");
    event.initEvent("ValueChange", true, true);
    this.dispatchEvent(event);

    return val;
  }

  get selectedItem() {
    // Make sure internally-selected item
    //  is in sync with inputField.value
    this._selectInputFieldValueInList();
    return this.mSelectedInternal;
  }

  set disableautoselect(val) {
    if (val) this.setAttribute("disableautoselect", "true");
    else this.removeAttribute("disableautoselect");
    return val;
  }

  get disableautoselect() {
    return this.hasAttribute("disableautoselect");
  }

  get editor() {
    const nsIDOMNSEditableElement =
      Components.interfaces.nsIDOMNSEditableElement;
    return this.inputField.QueryInterface(nsIDOMNSEditableElement).editor;
  }

  set readOnly(val) {
    this.inputField.readOnly = val;
    if (val) this.setAttribute("readonly", "true");
    else this.removeAttribute("readonly");
    return val;
  }

  get readOnly() {
    return this.inputField.readOnly;
  }
  _selectInputFieldValueInList() {
    if (this.hasAttribute("disableautoselect")) return;

    // Find and select the menuitem that matches inputField's "value"
    var arr = null;
    var popup = this.menupopup;

    if (popup)
      arr = popup.getElementsByAttribute("label", this.inputField.value);

    this.setSelectionInternal(arr ? arr.item(0) : null);
  }
  setSelectionInternal(val) {
    // This is called internally to set selected item
    //  without triggering infinite loop
    //  when using selectedItem's setter
    if (this.mSelectedInternal == val) return val;

    if (this.mSelectedInternal)
      this.mSelectedInternal.removeAttribute("selected");

    this.mSelectedInternal = val;

    if (val) val.setAttribute("selected", "true");

    // Do NOT change the "value", which is owned by inputField
    return val;
  }
  select() {}
}
customElements.define("xbl-menulist-editable", XblMenulistEditable);
