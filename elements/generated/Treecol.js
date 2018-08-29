class MozTreecol extends MozTreecolBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="treecol-text" inherits="crop,value=label" flex="1" crop="right"></label>
      <image class="treecol-sortdirection" inherits="sortDirection,hidden=hideheader"></image>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}