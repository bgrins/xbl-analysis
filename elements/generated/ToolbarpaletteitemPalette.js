class FirefoxToolbarpaletteitemPalette extends FirefoxToolbarpaletteitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="toolbarpaletteitem-box" inherits="type,place">
<children>
</children>
</xul:hbox>
<xul:label inherits="value=title">
</xul:label>`;
    let comment = document.createComment(
      "Creating firefox-toolbarpaletteitem-palette"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-toolbarpaletteitem-palette",
  FirefoxToolbarpaletteitemPalette
);
