/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCustomizableuiToolbarMenubarStub extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  get toolbox() {
    if (this._toolbox)
      return this._toolbox;

    if (this.parentNode && this.parentNode.localName == "toolbox") {
      this._toolbox = this.parentNode;
    }

    return this._toolbox;
  }

  get currentSet() {
    return this.getAttribute("defaultset");
  }

  insertItem() {
    return null;
  }

  _setupEventListeners() {

  }
}

customElements.define("customizableui-toolbar-menubar-stub", MozCustomizableuiToolbarMenubarStub);

}
