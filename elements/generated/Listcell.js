class Listcell extends Basecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right"></label>
      </children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}