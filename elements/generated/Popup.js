class FirefoxPopup extends FirefoxPopupBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
        <children></children>
      </xul:arrowscrollbox>
    `;

    this.scrollBox = document.getAnonymousElementByAttribute(this, "class", "popup-internal-box");

    this._setupEventListeners();
  }

  _setupEventListeners() {

    this.addEventListener("popupshowing", (event) => {
      var array = [];
      var width = 0;
      for (var menuitem = this.firstChild; menuitem; menuitem = menuitem.nextSibling) {
        if (menuitem.localName == "menuitem" && menuitem.hasAttribute("acceltext")) {
          var accel = document.getAnonymousElementByAttribute(menuitem, "anonid", "accel");
          if (accel && accel.boxObject) {
            array.push(accel);
            if (accel.boxObject.width > width)
              width = accel.boxObject.width;
          }
        }
      }
      for (var i = 0; i < array.length; i++)
        array[i].width = width;
    });

  }
}