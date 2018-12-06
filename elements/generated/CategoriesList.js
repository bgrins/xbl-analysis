/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCategoriesList extends MozRichlistbox {
  connectedCallback() {
    super.connectedCallback()
    if (this.delayConnectedCallback()) {
      return;
    }

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
}

customElements.define("categories-list", MozCategoriesList);

}
