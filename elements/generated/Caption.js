/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCaption extends MozBasetext {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <image class="caption-icon" inherits="src=image"></image>
        <label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey"></label>
      </children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}

customElements.define("caption", MozCaption);

}
