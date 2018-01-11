class FirefoxToolbox extends FirefoxToolbarBase {
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "palette", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.palette;
        return (this.palette = null);
      },
      set(val) {
        delete this.palette;
        return (this.palette = val);
      }
    });
  }
}
customElements.define("firefox-toolbox", FirefoxToolbox);
