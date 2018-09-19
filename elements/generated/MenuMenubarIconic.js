/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuMenubarIconic extends MozMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="menubar-left" inherits="src=image"></image>
      <label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></label>
      <children includes="menupopup"></children>
    `));

  }
}

customElements.define("menu-menubar-iconic", MozMenuMenubarIconic);

}
