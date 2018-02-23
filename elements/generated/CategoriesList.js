class FirefoxCategoriesList extends FirefoxRichlistbox {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }
  /**
   * This needs to be overridden to allow the fancy animation while not
   * allowing that item to be selected when hiding.
   */
  _canUserSelect(aItem) {
    if (aItem.hasAttribute("disabled") &&
      aItem.getAttribute("disabled") == "true")
      return false;
    var style = document.defaultView.getComputedStyle(aItem);
    return style.display != "none" && style.visibility == "visible";
  }

  _setupEventListeners() {

  }
}