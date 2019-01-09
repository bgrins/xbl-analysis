/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTabbrowserArrowscrollbox extends MozArrowscrollbox {
  constructor() {
    super();

    this.addEventListener("underflow", (event) => {
      // Ignore underflow events:
      // - from nested scrollable elements
      // - for vertical orientation
      // - corresponding to an overflow event that we ignored
      let tabs = document.getBindingParent(this);
      if (event.originalTarget != this.scrollbox ||
        event.detail == 0 ||
        !tabs.hasAttribute("overflow")) {
        return;
      }

      tabs.removeAttribute("overflow");

      if (tabs._lastTabClosedByMouse) {
        tabs._expandSpacerBy(this._scrollButtonDown.clientWidth);
      }

      for (let tab of Array.from(gBrowser._removingTabs)) {
        gBrowser.removeTab(tab);
      }

      tabs._positionPinnedTabs();
    }, true);

    this.addEventListener("overflow", (event) => {
      // Ignore overflow events:
      // - from nested scrollable elements
      // - for vertical orientation
      if (event.originalTarget != this.scrollbox ||
        event.detail == 0) {
        return;
      }

      var tabs = document.getBindingParent(this);
      tabs.setAttribute("overflow", "true");
      tabs._positionPinnedTabs();
      tabs._handleTabSelect(true);
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }

  }

  /**
   * Override scrollbox.xml method, since our scrollbox's children are
   * inherited from the binding parent
   */
  _getScrollableElements() {
    return Array.filter(document.getBindingParent(this).children,
      this._canScrollToElement, this);
  }

  _canScrollToElement(tab) {
    return !tab._pinnedUnscrollable && !tab.hidden;
  }
}

customElements.define("tabbrowser-arrowscrollbox", MozTabbrowserArrowscrollbox);

}
