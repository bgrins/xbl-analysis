/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCustomizableuiToolbar extends MozXULElement {
  connectedCallback() {

    let scope = {};
    ChromeUtils.import("resource:///modules/CustomizableUI.jsm", scope);
    let CustomizableUI = scope.CustomizableUI;

    // Searching for the toolbox palette in the toolbar binding because
    // toolbars are constructed first.
    let toolbox = this.closest("toolbox");
    if (toolbox && !toolbox.palette) {
      for (let node of toolbox.children) {
        if (node.localName == "toolbarpalette") {
          // Hold on to the palette but remove it from the document.
          toolbox.palette = node;
          toolbox.removeChild(node);
          break;
        }
      }
    }

    // pass the current set of children for comparison with placements:
    let children = Array.from(this.children)
      .filter(node => node.getAttribute("skipintoolbarset") != "true" && node.id)
      .map(node => node.id);
    CustomizableUI.registerToolbarNode(this, children);

  }

  get customizationTarget() {
    if (this._customizationTarget)
      return this._customizationTarget;

    let id = this.getAttribute("customizationtarget");
    if (id)
      this._customizationTarget = document.getElementById(id);

    if (!this._customizationTarget)
      this._customizationTarget = this;

    return this._customizationTarget;
  }
}

customElements.define("customizableui-toolbar", MozCustomizableuiToolbar);

}
