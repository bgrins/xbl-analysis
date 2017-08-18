class FirefoxRootElement extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-root-element");
    this.prepend(comment);

    Object.defineProperty(this, "_lightweightTheme", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lightweightTheme;
        return (this._lightweightTheme = null);
      }
    });

    try {
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
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-root-element", FirefoxRootElement);
