class XblMenulistEditable extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menulist-editable-box textbox-input-box" xbl:inherits="context,disabled,readonly,focused" flex="1">
<input class="menulist-editable-input" anonid="input" allowevents="true" xbl:inherits="value=label,value,disabled,tabindex,readonly,placeholder">
</input>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" xbl:inherits="open,disabled,parentfocused=focused">
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
}
customElements.define("xbl-menulist-editable", XblMenulistEditable);
