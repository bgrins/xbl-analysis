class XblToolbarbutton extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<image class="toolbarbutton-icon" xbl:inherits="validate,src=image,label,consumeanchor">
</image>
<label class="toolbarbutton-text" crop="right" flex="1" xbl:inherits="value=label,accesskey,crop,wrap">
</label>
<label class="toolbarbutton-multiline-text" flex="1" xbl:inherits="xbl:text=label,accesskey,wrap">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbarbutton ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton", XblToolbarbutton);
