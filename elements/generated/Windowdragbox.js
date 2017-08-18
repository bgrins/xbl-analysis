class FirefoxWindowdragbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-windowdragbox");
    this.prepend(comment);

    Object.defineProperty(this, "_dragBindingAlive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = true);
      },
      set(val) {
        delete this["_dragBindingAlive"];
        return (this["_dragBindingAlive"] = val);
      }
    });

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-windowdragbox", FirefoxWindowdragbox);
