class FirefoxToolbarpaletteitemSpacer extends FirefoxToolbarpaletteitem {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:spacer class="spacer-left"></xul:spacer>
      <children></children>
      <xul:spacer class="spacer-right"></xul:spacer>
    `;
  }
}
customElements.define(
  "firefox-toolbarpaletteitem-spacer",
  FirefoxToolbarpaletteitemSpacer
);
