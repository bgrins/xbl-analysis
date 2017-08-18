class FirefoxRootElement extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-root-element");
    this.prepend(comment);

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
    this._lightweightTheme = null;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-root-element", FirefoxRootElement);
