class Listhead extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <listheaditem>
        <children includes="listheader"></children>
      </listheaditem>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}