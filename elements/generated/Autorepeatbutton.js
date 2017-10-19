class FirefoxAutorepeatbutton extends FirefoxScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="autorepeatbutton-icon">
</xul:image>`;
    let comment = document.createComment("Creating firefox-autorepeatbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-autorepeatbutton", FirefoxAutorepeatbutton);
