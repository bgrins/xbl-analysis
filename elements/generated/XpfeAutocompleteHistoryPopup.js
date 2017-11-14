class FirefoxXpfeAutocompleteHistoryPopup extends FirefoxPopupScrollbars {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("popuphiding", event => {
      setTimeout(this.removeOpenAttribute, 0, this.parentNode);
    });
  }

  removeOpenAttribute(parentNode) {
    parentNode.removeAttribute("open");
  }
}
customElements.define(
  "firefox-xpfe-autocomplete-history-popup",
  FirefoxXpfeAutocompleteHistoryPopup
);
