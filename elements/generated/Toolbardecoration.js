class FirefoxToolbardecoration extends FirefoxToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-toolbardecoration");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbardecoration", FirefoxToolbardecoration);
