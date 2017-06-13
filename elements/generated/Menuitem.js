class XblMenuitem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xbl-text-label class="menu-text" inherits="value=label,accesskey,crop,highlightable" crop="right">
</xbl-text-label>
<hbox class="menu-accel-container" anonid="accel">
<xbl-text-label class="menu-accel" inherits="value=acceltext">
</xbl-text-label>
</hbox>`;
    let comment = document.createComment("Creating xbl-menuitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem", XblMenuitem);
