/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozHandler extends MozRichlistitem {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <vbox pack="center">
        <image inherits="src=image" height="32" width="32"></image>
      </vbox>
      <vbox flex="1">
        <label class="name" inherits="value=name"></label>
        <label class="description" inherits="value=description"></label>
      </vbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }

  get label() {
    return this.getAttribute('name') + ' ' + this.getAttribute('description');
  }
}

customElements.define("handler", MozHandler);

}
