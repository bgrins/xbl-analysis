class XblMenuMenubar extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<label class="menubar-text" xbl:inherits="value=label,accesskey,crop" crop="right">
</label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menu-menubar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-menubar", XblMenuMenubar);
