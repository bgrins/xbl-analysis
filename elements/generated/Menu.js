/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenu extends MozMenuBase {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="menu-text" inherits="value=label,accesskey,crop" crop="right"></label>
      <hbox class="menu-accel-container" anonid="accel">
        <label class="menu-accel" inherits="value=acceltext"></label>
      </hbox>
      <hbox align="center" class="menu-right" inherits="_moz-menuactive,disabled">
        <image></image>
      </hbox>
      <children includes="menupopup"></children>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
}

customElements.define("menu", MozMenu);

}
