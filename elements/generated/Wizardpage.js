/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozWizardpage extends MozXULElement {
  connectedCallback() {

    this.pageIndex = -1;

  }

  set pageid(val) {
    this.setAttribute('pageid', val);
  }

  get pageid() {
    return this.getAttribute('pageid');
  }

  set next(val) {
    this.setAttribute('next', val);
    this.parentNode._accessMethod = 'random';
    return val;
  }

  get next() {
    return this.getAttribute('next');
  }
}

customElements.define("wizardpage", MozWizardpage);

}
