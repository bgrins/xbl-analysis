class FirefoxAddengineIcon extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<image class="addengine-icon" inherits="src">
</image>
<image class="addengine-badge">
</image>`;
    let comment = document.createComment("Creating firefox-addengine-icon");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-addengine-icon", FirefoxAddengineIcon);
