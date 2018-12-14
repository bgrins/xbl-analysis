/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAutocompleteRichlistbox extends MozRichlistbox {
  constructor() {
    super();

    this.addEventListener("mouseup", (event) => {
      // Don't call onPopupClick for the scrollbar buttons, thumb, slider, etc.
      // If we hit the richlistbox and not a richlistitem, we ignore the event.
      if (event.originalTarget.closest("richlistbox,richlistitem").localName == "richlistbox") {
        return;
      }

      this.parentNode.onPopupClick(event);
    });

    this.addEventListener("mousemove", (event) => {
      if (Date.now() - this.mLastMoveTime <= 30) {
        return;
      }

      let item = event.target.closest("richlistbox,richlistitem");

      // If we hit the richlistbox and not a richlistitem, we ignore the event.
      if (item.localName == "richlistbox") {
        return;
      }

      let index = this.getIndexOfItem(item);

      this.mousedOverIndex = index;

      if (item.selectedByMouseOver) {
        this.selectedIndex = index;
      }

      this.mLastMoveTime = Date.now();
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }

    this.mLastMoveTime = Date.now();

    this.mousedOverIndex = -1;

  }
}

customElements.define("autocomplete-richlistbox", MozAutocompleteRichlistbox);

}
