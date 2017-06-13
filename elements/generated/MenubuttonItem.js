class XblMenubuttonItem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xbl-text-label class="menubutton-text" flex="1" inherits="value=label,accesskey,crop" crop="right">
</xbl-text-label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menubutton-item");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubutton-item", XblMenubuttonItem);
