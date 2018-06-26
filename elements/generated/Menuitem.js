class Menuitem extends MenuitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="menu-text" inherits="value=label,accesskey,crop,highlightable" crop="right"></label>
      <hbox class="menu-accel-container" anonid="accel">
        <label class="menu-accel" inherits="value=acceltext"></label>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}