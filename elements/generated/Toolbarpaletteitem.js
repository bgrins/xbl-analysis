class FirefoxToolbarpaletteitem extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox class="toolbarpaletteitem-box" flex="1" inherits="type,place">
        <children></children>
      </xul:hbox>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}