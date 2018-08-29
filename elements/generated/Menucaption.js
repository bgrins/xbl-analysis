class MozMenucaption extends MozMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,disabled,checked">
        <image class="menu-iconic-icon" inherits="src=image,validate,src"></image>
      </hbox>
      <label class="menu-iconic-text" flex="1" inherits="value=label,crop,highlightable" crop="right"></label>
      <label class="menu-iconic-highlightable-text" inherits="text=label,crop,highlightable" crop="right"></label>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}