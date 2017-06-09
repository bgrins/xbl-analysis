class XblToolbarpaletteitemPalette extends XblToolbarpaletteitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarpaletteitem-palette";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbarpaletteitem-palette",
  XblToolbarpaletteitemPalette
);
