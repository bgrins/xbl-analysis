class XblToolbarpaletteitemPalette extends XblToolbarpaletteitem {
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
<xbl-text-label inherits="value=title">
</xbl-text-label>`;
    let comment = document.createComment(
      "Creating xbl-toolbarpaletteitem-palette"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbarpaletteitem-palette",
  XblToolbarpaletteitemPalette
);
