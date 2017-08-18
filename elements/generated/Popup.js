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

    Object.defineProperty(this, "scrollBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.scrollBox;
        return (this.scrollBox = document.getAnonymousElementByAttribute(
          this,
          "class",
          "popup-internal-box"
        ));
      }
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-popup", FirefoxPopup);
