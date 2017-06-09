class XblToolbarpaletteitemPalette extends XblToolbarpaletteitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="toolbarpaletteitem-box" xbl:inherits="type,place">
<children>
</children>
</hbox>
<label xbl:inherits="value=title">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbarpaletteitem-palette ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbarpaletteitem-palette",
  XblToolbarpaletteitemPalette
);
