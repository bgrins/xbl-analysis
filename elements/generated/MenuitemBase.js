/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuitemBase extends MozBasetext {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }

  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }
  /**
   * nsIDOMXULSelectControlItemElement
   */
  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  get control() {
    var parent = this.parentNode;
    // Return the parent if it is a menu or menulist.
    if (parent && parent.parentNode instanceof XULMenuElement) {
      return parent.parentNode;
    }
    return null;
  }
  /**
   * nsIDOMXULContainerItemElement
   */
  get parentContainer() {
    for (var parent = this.parentNode; parent; parent = parent.parentNode) {
      if (parent instanceof XULMenuElement) {
        return parent;
      }
    }
    return null;
  }
}

MozXULElement.implementCustomInterface(MozMenuitemBase, [Ci.nsIDOMXULSelectControlItemElement, Ci.nsIDOMXULContainerItemElement]);
customElements.define("menuitem-base", MozMenuitemBase);

}
