class FirefoxMenucaption extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:label class="menu-text" inherits="value=label,crop" crop="right">
</xul:label>`;
    let comment = document.createComment("Creating firefox-menucaption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menucaption", FirefoxMenucaption);
