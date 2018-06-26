class ListitemIconic extends Listitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <listcell class="listcell-iconic" inherits="label,image,crop,disabled,flexlabel"></listcell>
      </children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}