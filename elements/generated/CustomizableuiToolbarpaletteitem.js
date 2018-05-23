class FirefoxCustomizableuiToolbarpaletteitem extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox class="toolbarpaletteitem-box">
        <children></children>
      </xul:hbox>
      <xul:label class="toolbarpaletteitem-label" inherits="text=title"></xul:label>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}