/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozWizardHeader extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="wizard-header-box-1" flex="1">
        <vbox class="wizard-header-box-text" flex="1">
          <label class="wizard-header-label" inherits="text=label"></label>
          <label class="wizard-header-description" inherits="text=description"></label>
        </vbox>
        <image class="wizard-header-icon" inherits="src=iconsrc"></image>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}

customElements.define("wizard-header", MozWizardHeader);

}
