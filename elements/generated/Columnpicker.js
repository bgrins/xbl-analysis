class XblColumnpicker extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="tree-columnpicker-icon">
</image>
<menupopup anonid="popup">
<menuseparator anonid="menuseparator">
</menuseparator>
<menuitem anonid="menuitem" label="&restoreColumnOrder.label;">
</menuitem>
</menupopup>`;
    let comment = document.createComment("Creating xbl-columnpicker");
    this.prepend(comment);
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
customElements.define("xbl-columnpicker", XblColumnpicker);
