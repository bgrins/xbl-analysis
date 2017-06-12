class XblMenubuttonItem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<label class="menubutton-text" flex="1" xbl:inherits="value=label,accesskey,crop" crop="right">
</label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menubutton-item");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubutton-item", XblMenubuttonItem);
