/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTextarea extends MozTextbox {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <moz-input-box anonid="moz-input-box" flex="1" inherits="context,spellcheck">
        <html:textarea class="textbox-textarea" anonid="input" inherits="text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
          <children></children>
        </html:textarea>
      </moz-input-box>
    `));

  }
}

customElements.define("textarea", MozTextarea);

}
