class XblMenulistEditable extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="menulist-editable-box textbox-input-box" xbl:inherits="context,disabled,readonly,focused" flex="1">
<input class="menulist-editable-input" anonid="input" allowevents="true" xbl:inherits="value=label,value,disabled,tabindex,readonly,placeholder">
</input>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" xbl:inherits="open,disabled,parentfocused=focused">
</dropmarker>
<children includes="menupopup">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menulist-editable ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-editable", XblMenulistEditable);
