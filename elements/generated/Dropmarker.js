class FirefoxDropmarker extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="dropmarker-icon">
</xul:image>`;
    let comment = document.createComment("Creating firefox-dropmarker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-dropmarker", FirefoxDropmarker);
