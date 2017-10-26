class FirefoxToolbarpaletteitemPalette extends FirefoxToolbarpaletteitem {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="toolbarpaletteitem-box" inherits="type,place">
        <children></children>
      </xul:hbox>
      <xul:label inherits="value=title"></xul:label>
    `;
  }
}
customElements.define(
  "firefox-toolbarpaletteitem-palette",
  FirefoxToolbarpaletteitemPalette
);
