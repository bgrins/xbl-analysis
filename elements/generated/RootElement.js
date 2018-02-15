class FirefoxRootElement extends XULElement {
  connectedCallback() {
    this._lightweightTheme = null;

    if (this.hasAttribute("lightweightthemes")) {
      let temp = {};
      ChromeUtils.import(
        "resource://gre/modules/LightweightThemeConsumer.jsm",
        temp
      );
      this._lightweightTheme = new temp.LightweightThemeConsumer(
        this.ownerDocument
      );
    }
  }
  disconnectedCallback() {
    if (this._lightweightTheme) {
      this._lightweightTheme.destroy();
      this._lightweightTheme = null;
    }
  }
}
customElements.define("firefox-root-element", FirefoxRootElement);
