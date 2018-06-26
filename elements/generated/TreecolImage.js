class TreecolImage extends TreecolBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="treecol-icon" inherits="src"></image>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}