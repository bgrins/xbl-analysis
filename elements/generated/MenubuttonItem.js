class FirefoxMenubuttonItem extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<firefox-text-label class="menubutton-text" flex="1" inherits="value=label,accesskey,crop" crop="right">
</firefox-text-label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating firefox-menubutton-item");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menubutton-item", FirefoxMenubuttonItem);
