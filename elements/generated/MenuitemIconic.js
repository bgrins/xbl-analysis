class XblMenuitemIconic extends XblMenuitem {
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
<xbl-text-label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right">
</xbl-text-label>
<xbl-text-label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right">
</xbl-text-label>
<children>
</children>
<hbox class="menu-accel-container" anonid="accel">
<xbl-text-label class="menu-iconic-accel" inherits="value=acceltext">
</xbl-text-label>
</hbox>`;
    let comment = document.createComment("Creating xbl-menuitem-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-iconic", XblMenuitemIconic);
