class FirefoxRootElement extends XULElement {
  connectedCallback() {
    Object.defineProperty(this, "_lightweightTheme", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lightweightTheme;
        return (this._lightweightTheme = null);
      },
      set(val) {
        delete this._lightweightTheme;
        return (this._lightweightTheme = val);
      }
    });

    if (this.hasAttribute("lightweightthemes")) {
      let temp = {};
      Components.utils.import(
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
