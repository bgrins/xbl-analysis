class FirefoxTreebody extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-treebody");
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
    this._lastSelectedRow = -1;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treebody", FirefoxTreebody);
