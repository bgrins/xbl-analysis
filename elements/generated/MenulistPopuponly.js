/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenulistPopuponly extends MozMenulist {
  connectedCallback() {
    super.connectedCallback()
    if (this.delayConnectedCallback()) {
      return;
    }
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="menupopup"></children>
    `));

  }
}

customElements.define("menulist-popuponly", MozMenulistPopuponly);

}
