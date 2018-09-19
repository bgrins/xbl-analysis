/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozBasecontrol extends MozXULElement {
  connectedCallback() {

  }
  /**
   * public implementation
   */
  set disabled(val) {
    if (val) this.setAttribute('disabled', 'true');
    else this.removeAttribute('disabled');
    return val;
  }

  get disabled() {
    return this.getAttribute('disabled') == 'true';
  }

  set tabIndex(val) {
    if (val) this.setAttribute('tabindex', val);
    else this.removeAttribute('tabindex');
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute('tabindex')) || 0
  }
}

MozXULElement.implementCustomInterface(MozBasecontrol, [Ci.nsIDOMXULControlElement]);
customElements.define("basecontrol", MozBasecontrol);

}
