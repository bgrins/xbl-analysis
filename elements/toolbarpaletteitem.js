class XblToolbarpaletteitem extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="toolbarpaletteitem-box" flex="1" xbl:inherits="type,place">
<children>
</children>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbarpaletteitem ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarpaletteitem", XblToolbarpaletteitem);
