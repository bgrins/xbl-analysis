class FirefoxCategoriesList extends FirefoxRichlistbox {
  connectedCallback() {
    super.connectedCallback();
  }

  _canUserSelect(aItem) {
    if (
      aItem.hasAttribute("disabled") &&
      aItem.getAttribute("disabled") == "true"
    )
      return false;
    var style = document.defaultView.getComputedStyle(aItem);
    return style.display != "none" && style.visibility == "visible";
  }
}
customElements.define("firefox-categories-list", FirefoxCategoriesList);
