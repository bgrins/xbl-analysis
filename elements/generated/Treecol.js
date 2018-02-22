class FirefoxTreecol extends FirefoxTreecolBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:label class="treecol-text" inherits="crop,value=label" flex="1" crop="right"></xul:label>
      <xul:image class="treecol-sortdirection" inherits="sortDirection,hidden=hideheader"></xul:image>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}