/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozDetailRow extends MozXULElement {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="detail-row-label" inherits="value=label"></label>
      <label class="detail-row-value" inherits="value"></label>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }

  set value(val) {
    if (!val)
      this.removeAttribute("value");
    else
      this.setAttribute("value", val);
  }

  get value() {
    return this.getAttribute("value");
  }
}

customElements.define("detail-row", MozDetailRow);

}
