/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTreerows extends MozBaseControl {
  constructor() {
    super();

    this.addEventListener("underflow", (event) => {
      // Scrollport event orientation
      // 0: vertical
      // 1: horizontal
      // 2: both (not used)
      var tree = document.getBindingParent(this);
      if (event.detail == 1)
        tree.setAttribute("hidehscroll", "true");
      else if (event.detail == 0)
        tree.setAttribute("hidevscroll", "true");
      event.stopPropagation();
    });

    this.addEventListener("overflow", (event) => {
      var tree = document.getBindingParent(this);
      if (event.detail == 1)
        tree.removeAttribute("hidehscroll");
      else if (event.detail == 0)
        tree.removeAttribute("hidevscroll");
      event.stopPropagation();
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox flex="1" class="tree-bodybox">
        <children></children>
      </hbox>
      <scrollbar height="0" minwidth="0" minheight="0" orient="vertical" inherits="collapsed=hidevscroll" style="position:relative; z-index:2147483647;" oncontextmenu="event.stopPropagation(); event.preventDefault();" onclick="event.stopPropagation(); event.preventDefault();" ondblclick="event.stopPropagation();" oncommand="event.stopPropagation();"></scrollbar>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
}

customElements.define("treerows", MozTreerows);

}
