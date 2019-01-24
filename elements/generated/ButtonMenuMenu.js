/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozButtonMenuMenu extends MozButton {
  constructor() {
    super();

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RETURN) {
        return;
      }
      this.open = true;
    });

    this.addEventListener("keypress", (event) => {
      this.open = true;
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <hbox class="box-inherit button-box" inherits="align,dir,pack,orient" align="center" pack="center" flex="1">
        <hbox class="box-inherit" inherits="align,dir,pack,orient" align="center" pack="center" flex="1">
          <image class="button-icon" inherits="src=image"></image>
          <label class="button-text" inherits="value=label,accesskey,crop"></label>
        </hbox>
        <dropmarker class="button-menu-dropmarker" inherits="open,disabled,label"></dropmarker>
      </hbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
}

customElements.define("button-menu-menu", MozButtonMenuMenu);

}
