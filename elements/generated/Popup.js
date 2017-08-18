class FirefoxPopup extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
<children>
</children>
</arrowscrollbox>`;
    let comment = document.createComment("Creating firefox-popup");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get scrollBox() {
    return document.getAnonymousElementByAttribute(
      this,
      "class",
      "popup-internal-box"
    );
  }
}
customElements.define("firefox-popup", FirefoxPopup);
