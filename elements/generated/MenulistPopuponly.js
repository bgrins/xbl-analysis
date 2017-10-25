class FirefoxMenulistPopuponly extends FirefoxMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children includes="menupopup">
</children>`;
  }
}
customElements.define("firefox-menulist-popuponly", FirefoxMenulistPopuponly);
