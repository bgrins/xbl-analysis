/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMarqueeVerticalEditable extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div style="overflow: auto; height: inherit; width: -moz-available;">
        <children></children>
      </html:div>
    `));

  }
}

customElements.define("marquee-vertical-editable", MozMarqueeVerticalEditable);

}
