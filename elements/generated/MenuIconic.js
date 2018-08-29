class MozMenuIconic extends MozMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="menu-iconic-left" align="center" pack="center">
        <image class="menu-iconic-icon" inherits="src=image"></image>
      </hbox>
      <label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right"></label>
      <label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right"></label>
      <hbox class="menu-accel-container" anonid="accel">
        <label class="menu-iconic-accel" inherits="value=acceltext"></label>
      </hbox>
      <hbox align="center" class="menu-right" inherits="_moz-menuactive,disabled">
        <image></image>
      </hbox>
      <children includes="menupopup|template"></children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}