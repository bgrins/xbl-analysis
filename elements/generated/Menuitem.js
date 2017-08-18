class FirefoxMenuitem extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<firefox-text-label class="menu-text" inherits="value=label,accesskey,crop,highlightable" crop="right">
</firefox-text-label>
<hbox class="menu-accel-container" anonid="accel">
<firefox-text-label class="menu-accel" inherits="value=acceltext">
</firefox-text-label>
</hbox>`;
    let comment = document.createComment("Creating firefox-menuitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menuitem", FirefoxMenuitem);
