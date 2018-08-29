/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozPrettyprint extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div id="top"></html:div>
      <html:span style="display: none;">
        <children></children>
      </html:span>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("prettyprint-dom-created", (event) => {
      let container = document.getAnonymousNodes(this).item(0);
      // Take the child nodes from the passed <div id="top">
      // and append them to our own.
      for (let el of event.detail.childNodes) {
        container.appendChild(el);
      }
    });

  }
}

customElements.define("prettyprint", MozPrettyprint);

}
