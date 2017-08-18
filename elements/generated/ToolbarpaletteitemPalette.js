class FirefoxToolbarpaletteitemPalette extends FirefoxToolbarpaletteitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="toolbarpaletteitem-box" inherits="type,place">
<children>
</children>
</hbox>
<firefox-text-label inherits="value=title">
</firefox-text-label>`;
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
