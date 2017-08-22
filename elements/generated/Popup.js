class FirefoxPopup extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
<children>
</children>
</arrowscrollbox>`;
    let comment = document.createComment("Creating firefox-popup");
    this.prepend(comment);

    Object.defineProperty(this, "scrollBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.scrollBox;
        return (this.scrollBox = document.getAnonymousElementByAttribute(
          this,
          "class",
          "popup-internal-box"
        ));
      },
      set(val) {
        delete this.scrollBox;
        return (this.scrollBox = val);
      }
    });

    this.addEventListener("popupshowing", event => {
      var array = [];
      var width = 0;
      for (
        var menuitem = this.firstChild;
        menuitem;
        menuitem = menuitem.nextSibling
      ) {
        if (
          menuitem.localName == "menuitem" &&
          menuitem.hasAttribute("acceltext")
        ) {
          var accel = document.getAnonymousElementByAttribute(
            menuitem,
            "anonid",
            "accel"
          );
          if (accel && accel.boxObject) {
            array.push(accel);
            if (accel.boxObject.width > width) width = accel.boxObject.width;
          }
        }
      }
      for (var i = 0; i < array.length; i++) array[i].width = width;
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-popup", FirefoxPopup);
