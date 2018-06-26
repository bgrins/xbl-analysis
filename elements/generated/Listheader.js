class Listheader extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="listheader-icon"></image>
      <label class="listheader-label" inherits="value=label,crop" flex="1" crop="right"></label>
      <image class="listheader-sortdirection" inherits="sortDirection"></image>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}