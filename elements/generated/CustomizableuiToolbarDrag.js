/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCustomizableuiToolbarDrag extends MozCustomizableuiToolbar {
  connectedCallback() {
    super.connectedCallback()

    this._dragBindingAlive = true;

    if (!this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        ChromeUtils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
        let draggableThis = new tmp.WindowDraggingElement(this);
        draggableThis.mouseDownCheck = function(e) {
          return this._dragBindingAlive;
        };
      } catch (e) {}
    }

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}

customElements.define("customizableui-toolbar-drag", MozCustomizableuiToolbarDrag);

}
