/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozColumnpicker extends MozTreeBase {
  constructor() {
    super();

    this.addEventListener("command", (event) => {
      if (event.originalTarget == this) {
        var popup = document.getAnonymousElementByAttribute(this, "anonid", "popup");
        this.buildPopup(popup);
        popup.openPopup(this, "after_end");
      } else {
        var tree = this.parentNode.parentNode;
        tree.stopEditing(true);
        var menuitem = document.getAnonymousElementByAttribute(this, "anonid", "menuitem");
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
            else
              element.setAttribute("hidden", "true");
          }
        }
      }
    });

  }

  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="tree-columnpicker-icon"></image>
      <menupopup anonid="popup">
        <menuseparator anonid="menuseparator"></menuseparator>
        <menuitem anonid="menuitem" label="FROM-DTD.restoreColumnOrder.label;"></menuitem>
      </menupopup>
    `));

  }

  buildPopup(aPopup) {
    // We no longer cache the picker content, remove the old content.
    while (aPopup.childNodes.length > 2)
      aPopup.firstChild.remove();

    var refChild = aPopup.firstChild;

    var tree = this.parentNode.parentNode;
    for (var currCol = tree.columns.getFirstColumn(); currCol; currCol = currCol.getNext()) {
      // Construct an entry for each column in the row, unless
      // it is not being shown.
      var currElement = currCol.element;
      if (!currElement.hasAttribute("ignoreincolumnpicker")) {
        var popupChild = document.createElement("menuitem");
        popupChild.setAttribute("type", "checkbox");
        var columnName = currElement.getAttribute("display") ||
          currElement.getAttribute("label");
        popupChild.setAttribute("label", columnName);
        popupChild.setAttribute("colindex", currCol.index);
        if (currElement.getAttribute("hidden") != "true")
          popupChild.setAttribute("checked", "true");
        if (currCol.primary)
          popupChild.setAttribute("disabled", "true");
        aPopup.insertBefore(popupChild, refChild);
      }
    }

    var hidden = !tree.enableColumnDrag;
    const anonids = ["menuseparator", "menuitem"];
    for (var i = 0; i < anonids.length; i++) {
      var element = document.getAnonymousElementByAttribute(this, "anonid", anonids[i]);
      element.hidden = hidden;
    }
  }
}

customElements.define("columnpicker", MozColumnpicker);

}
