/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozScrollbox extends MozBaseControl {
  connectedCallback() {
    super.connectedCallback()
    if (this.delayConnectedCallback()) {
      return;
    }
    this.appendChild(MozXULElement.parseXULToFragment(`
      <box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
        <children></children>
      </box>
    `));

  }
}

customElements.define("scrollbox", MozScrollbox);

}
