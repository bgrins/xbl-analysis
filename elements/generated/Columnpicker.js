class FirefoxColumnpicker extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="tree-columnpicker-icon">
</xul:image>
<xul:menupopup anonid="popup">
<xul:menuseparator anonid="menuseparator">
</xul:menuseparator>
<xul:menuitem anonid="menuitem" label="FROM-DTD-restoreColumnOrder-label">
</xul:menuitem>
</xul:menupopup>`;

    this.addEventListener("command", event => {
      if (event.originalTarget == this) {
        var popup = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "popup"
        );
        this.buildPopup(popup);
        popup.showPopup(this, -1, -1, "popup", "bottomright", "topright");
      } else {
        var tree = this.parentNode.parentNode;
        tree.stopEditing(true);
        var menuitem = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "menuitem"
        );
        if (event.originalTarget == menuitem) {
          tree.columns.restoreNaturalOrder();
          tree._ensureColumnOrder();
        } else {
          var colindex = event.originalTarget.getAttribute("colindex");
          var column = tree.columns[colindex];
          if (column) {
            var element = column.element;
            if (element.getAttribute("hidden") == "true")
              element.setAttribute("hidden", "false");
            else element.setAttribute("hidden", "true");
          }
        }
      }
    });
  }
  disconnectedCallback() {}
  buildPopup(aPopup) {
    // We no longer cache the picker content, remove the old content.
    while (aPopup.childNodes.length > 2) aPopup.firstChild.remove();

    var refChild = aPopup.firstChild;

    var tree = this.parentNode.parentNode;
    for (
      var currCol = tree.columns.getFirstColumn();
      currCol;
      currCol = currCol.getNext()
    ) {
      // Construct an entry for each column in the row, unless
      // it is not being shown.
      var currElement = currCol.element;
      if (!currElement.hasAttribute("ignoreincolumnpicker")) {
        var popupChild = document.createElement("menuitem");
        popupChild.setAttribute("type", "checkbox");
        var columnName =
          currElement.getAttribute("display") ||
          currElement.getAttribute("label");
        popupChild.setAttribute("label", columnName);
        popupChild.setAttribute("colindex", currCol.index);
        if (currElement.getAttribute("hidden") != "true")
          popupChild.setAttribute("checked", "true");
        if (currCol.primary) popupChild.setAttribute("disabled", "true");
        aPopup.insertBefore(popupChild, refChild);
      }
    }

    var hidden = !tree.enableColumnDrag;
    const anonids = ["menuseparator", "menuitem"];
    for (var i = 0; i < anonids.length; i++) {
      var element = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        anonids[i]
      );
      element.hidden = hidden;
    }
  }
}
customElements.define("firefox-columnpicker", FirefoxColumnpicker);
