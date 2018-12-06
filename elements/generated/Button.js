/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozButton extends MozButtonBase {
  connectedCallback() {
    super.connectedCallback()
    if (this.delayConnectedCallback()) {
      return;
    }
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <hbox class="box-inherit button-box" inherits="align,dir,pack,orient" align="center" pack="center" flex="1" anonid="button-box">
        <image class="button-icon" inherits="src=image"></image>
        <label class="button-text" inherits="value=label,accesskey,crop,highlightable"></label>
        <label class="button-highlightable-text" inherits="text=label,accesskey,crop,highlightable"></label>
      </hbox>
    `));

  }
}

customElements.define("button", MozButton);

}
