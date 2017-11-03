class FirefoxHistoryDropmarker extends FirefoxDropmarker {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("mousedown", event => {
      this.showPopup();
    });
  }

  showPopup() {
    var textbox = document.getBindingParent(this);
    var kids = textbox.getElementsByClassName("autocomplete-history-popup");
    if (kids.item(0) && textbox.getAttribute("open") != "true") {
      // Open history popup
      var w = textbox.boxObject.width;
      if (w != kids[0].boxObject.width) kids[0].width = w;
      kids[0].showPopup(textbox, -1, -1, "popup", "bottomleft", "topleft");
      textbox.setAttribute("open", "true");
    }
  }
}
customElements.define("firefox-history-dropmarker", FirefoxHistoryDropmarker);
