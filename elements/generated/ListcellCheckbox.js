class ListcellCheckbox extends Listcell {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <image class="listcell-check" inherits="checked,disabled"></image>
        <label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right"></label>
      </children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}