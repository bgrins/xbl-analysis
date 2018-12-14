/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuBase extends MozMenuitemBase {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }

  }

  set open(val) {
    this.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute('open');
  }

  get itemCount() {
    var menupopup = this.menupopup;
    return menupopup ? menupopup.children.length : 0;
  }

  get menupopup() {
    const XUL_NS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    for (var child = this.firstElementChild; child; child = child.nextElementSibling) {
      if (child.namespaceURI == XUL_NS && child.localName == "menupopup")
        return child;
    }
    return null;
  }

  /**
   * nsIDOMXULContainerElement interface
   */
  appendItem(aLabel, aValue) {
    var menupopup = this.menupopup;
    if (!menupopup) {
      menupopup = this.ownerDocument.createXULElement("menupopup");
      this.appendChild(menupopup);
    }

    var menuitem = this.ownerDocument.createXULElement("menuitem");
    menuitem.setAttribute("label", aLabel);
    menuitem.setAttribute("value", aValue);

    return menupopup.appendChild(menuitem);
  }

  getIndexOfItem(aItem) {
    var menupopup = this.menupopup;
    if (menupopup) {
      var items = menupopup.children;
      var length = items.length;
      for (var index = 0; index < length; ++index) {
        if (items[index] == aItem)
          return index;
      }
    }
    return -1;
  }

  getItemAtIndex(aIndex) {
    var menupopup = this.menupopup;
    if (!menupopup || aIndex < 0 || aIndex >= menupopup.children.length)
      return null;

    return menupopup.children[aIndex];
  }
}

MozXULElement.implementCustomInterface(MozMenuBase, [Ci.nsIDOMXULContainerElement]);
customElements.define("menu-base", MozMenuBase);

}
