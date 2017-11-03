class FirefoxAutocompleteHistoryPopup extends FirefoxPopupScrollbars {
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
  "firefox-autocomplete-history-popup",
  FirefoxAutocompleteHistoryPopup
);
