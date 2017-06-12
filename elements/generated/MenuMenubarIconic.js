class XblMenuMenubarIconic extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="menubar-left" xbl:inherits="src=image">
</image>
<label class="menubar-text" xbl:inherits="value=label,accesskey,crop" crop="right">
</label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menu-menubar-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-menubar-iconic", XblMenuMenubarIconic);
