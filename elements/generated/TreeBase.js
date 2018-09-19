/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTreeBase extends MozBasecontrol {
  connectedCallback() {
    super.connectedCallback()

  }

  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }
}

customElements.define("tree-base", MozTreeBase);

}
