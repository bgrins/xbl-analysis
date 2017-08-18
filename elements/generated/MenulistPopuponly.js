class FirefoxMenulistPopuponly extends FirefoxMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating firefox-menulist-popuponly");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menulist-popuponly", FirefoxMenulistPopuponly);
