class XblToolbarpaletteitem extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="toolbarpaletteitem-box" flex="1" xbl:inherits="type,place">
<children>
</children>
</hbox>`;
    let comment = document.createComment("Creating xbl-toolbarpaletteitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarpaletteitem", XblToolbarpaletteitem);
