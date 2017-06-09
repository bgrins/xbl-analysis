class XblToolbarbuttonBadged extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<stack class="toolbarbutton-badge-stack">
<image class="toolbarbutton-icon" xbl:inherits="validate,src=image,label,consumeanchor">
</image>
<label class="toolbarbutton-badge" xbl:inherits="value=badge" top="0" end="0" crop="none">
</label>
</stack>
<label class="toolbarbutton-text" crop="right" flex="1" xbl:inherits="value=label,accesskey,crop,wrap">
</label>
<label class="toolbarbutton-multiline-text" flex="1" xbl:inherits="xbl:text=label,accesskey,wrap">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbarbutton-badged ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-badged", XblToolbarbuttonBadged);
