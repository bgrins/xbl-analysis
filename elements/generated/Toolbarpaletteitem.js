class FirefoxToolbarpaletteitem extends FirefoxToolbarBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="toolbarpaletteitem-box" flex="1" inherits="type,place">
        <children></children>
      </xul:hbox>
    `;

  }

}