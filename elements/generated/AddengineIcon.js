class FirefoxAddengineIcon extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="addengine-icon" inherits="src">
</xul:image>
<xul:image class="addengine-badge">
</xul:image>`;
    let comment = document.createComment("Creating firefox-addengine-icon");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-addengine-icon", FirefoxAddengineIcon);
