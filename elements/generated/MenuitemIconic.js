/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuitemIconic extends MozMenuitem {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,_moz-menuactive,disabled,checked">
        <image class="menu-iconic-icon" inherits="src=image,triggeringprincipal=iconloadingprincipal,validate,src"></image>
      </hbox>
      <label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right"></label>
      <label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right"></label>
      <children></children>
      <hbox class="menu-accel-container" anonid="accel">
        <label class="menu-iconic-accel" inherits="value=acceltext"></label>
      </hbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
}

customElements.define("menuitem-iconic", MozMenuitemIconic);

}
