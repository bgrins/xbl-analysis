/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMarqueeHorizontal extends MozMarquee {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div style="display: -moz-box; overflow: hidden; width: -moz-available;">
        <html:div style="display: -moz-box;">
          <html:div class="innerDiv" style="display: table; border-spacing: 0;">
            <html:div>
              <children></children>
            </html:div>
          </html:div>
        </html:div>
      </html:div>
    `));

  }
}

customElements.define("marquee-horizontal", MozMarqueeHorizontal);

}
