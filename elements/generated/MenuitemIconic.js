class MenuitemIconic extends Menuitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,_moz-menuactive,disabled,checked">
        <image class="menu-iconic-icon" inherits="src=image,triggeringprincipal=iconloadingprincipal,validate,src"></image>
      </hbox>
      <label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right"></label>
      <label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right"></label>
      <children></children>
      <hbox class="menu-accel-container" anonid="accel">
        <label class="menu-iconic-accel" inherits="value=acceltext"></label>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}