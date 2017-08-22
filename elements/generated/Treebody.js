class FirefoxTreebody extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-treebody");
    this.prepend(comment);

    Object.defineProperty(this, "_lastSelectedRow", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastSelectedRow;
        return (this._lastSelectedRow = -1);
      },
      set(val) {
        delete this._lastSelectedRow;
        return (this._lastSelectedRow = val);
      }
    });

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treebody", FirefoxTreebody);
