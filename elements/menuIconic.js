class XblMenuIconic extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center">
<image class="menu-iconic-icon" xbl:inherits="src=image">
</image>
</hbox>
<label class="menu-iconic-text" flex="1" xbl:inherits="value=label,accesskey,crop,highlightable" crop="right">
</label>
<label class="menu-iconic-highlightable-text" xbl:inherits="xbl:text=label,crop,accesskey,highlightable" crop="right">
</label>
<hbox class="menu-accel-container" anonid="accel">
<label class="menu-iconic-accel" xbl:inherits="value=acceltext">
</label>
</hbox>
<hbox align="center" class="menu-right" xbl:inherits="_moz-menuactive,disabled">
<image>
</image>
</hbox>
<children includes="menupopup|template">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-iconic", XblMenuIconic);
