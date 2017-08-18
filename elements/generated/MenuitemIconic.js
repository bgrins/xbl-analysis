class FirefoxMenuitemIconic extends FirefoxMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,_moz-menuactive,disabled,checked">
<image class="menu-iconic-icon" inherits="src=image,validate,src">
</image>
</hbox>
<firefox-text-label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right">
</firefox-text-label>
<firefox-text-label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right">
</firefox-text-label>
<children>
</children>
<hbox class="menu-accel-container" anonid="accel">
<firefox-text-label class="menu-iconic-accel" inherits="value=acceltext">
</firefox-text-label>
</hbox>`;
    let comment = document.createComment("Creating firefox-menuitem-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menuitem-iconic", FirefoxMenuitemIconic);
