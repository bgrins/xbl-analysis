class XblMenuitem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<label class="menu-text" xbl:inherits="value=label,accesskey,crop,highlightable" crop="right">
</label>
<hbox class="menu-accel-container" anonid="accel">
<label class="menu-accel" xbl:inherits="value=acceltext">
</label>
</hbox>`;
    let comment = document.createComment("Creating xbl-menuitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem", XblMenuitem);
