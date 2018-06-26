class CustomizableuiToolbarpaletteitem extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="toolbarpaletteitem-box">
        <children></children>
      </hbox>
      <label class="toolbarpaletteitem-label" inherits="text=title"></label>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}