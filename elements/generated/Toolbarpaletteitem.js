class FirefoxToolbarpaletteitem extends FirefoxToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="toolbarpaletteitem-box" flex="1" inherits="type,place">
<children>
</children>
</hbox>`;
    let comment = document.createComment("Creating firefox-toolbarpaletteitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarpaletteitem", FirefoxToolbarpaletteitem);
