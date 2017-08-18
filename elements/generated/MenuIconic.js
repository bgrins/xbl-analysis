class FirefoxMenuIconic extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center">
<image class="menu-iconic-icon" inherits="src=image">
</image>
</hbox>
<firefox-text-label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right">
</firefox-text-label>
<firefox-text-label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right">
</firefox-text-label>
<hbox class="menu-accel-container" anonid="accel">
<firefox-text-label class="menu-iconic-accel" inherits="value=acceltext">
</firefox-text-label>
</hbox>
<hbox align="center" class="menu-right" inherits="_moz-menuactive,disabled">
<image>
</image>
</hbox>
<children includes="menupopup|template">
</children>`;
    let comment = document.createComment("Creating firefox-menu-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menu-iconic", FirefoxMenuIconic);
