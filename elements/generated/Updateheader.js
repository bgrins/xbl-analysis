/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozUpdateheader extends MozWizardHeader {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="wizard-header update-header" flex="1">
        <vbox class="wizard-header-box-1">
          <vbox class="wizard-header-box-text">
            <label class="wizard-header-label" inherits="value=label"></label>
          </vbox>
        </vbox>
      </hbox>
    `));

  }
}

customElements.define("updateheader", MozUpdateheader);

}
