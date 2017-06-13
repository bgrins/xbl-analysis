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

  set label(val) {
    this.inputField.value = val;
    return val;
  }

  get label() {
    return this.inputField.value;
  }

  get value() {
    return this.inputField.value;
  }

  set disableautoselect(val) {
    if (val) this.setAttribute("disableautoselect", "true");
    else this.removeAttribute("disableautoselect");
    return val;
  }

  get disableautoselect() {
    return this.hasAttribute("disableautoselect");
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
