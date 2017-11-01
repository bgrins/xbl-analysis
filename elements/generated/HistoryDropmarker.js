class FirefoxHistoryDropmarker extends FirefoxDropmarker {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("mousedown", event => {
      document.getBindingParent(this).toggleHistoryPopup();
    });
  }
}
customElements.define("firefox-history-dropmarker", FirefoxHistoryDropmarker);
