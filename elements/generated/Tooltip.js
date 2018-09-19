/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTooltip extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("mouseover", (event) => {
      var rel = event.relatedTarget;
      if (!rel)
        return;

      // find out if the node we entered from is one of our anonymous children
      while (rel) {
        if (rel == this)
          break;
        rel = rel.parentNode;
      }

      // if the exited node is not a descendant of ours, we are entering for the first time
      if (rel != this)
        this._isMouseOver = true;
    });

    this.addEventListener("mouseout", (event) => {
      var rel = event.relatedTarget;

      // relatedTarget is null when the titletip is first shown: a mouseout event fires
      // because the mouse is exiting the main window and entering the titletip "window".
      // relatedTarget is also null when the mouse exits the main window completely,
      // so count how many times relatedTarget was null after titletip is first shown
      // and hide popup the 2nd time
      if (!rel) {
        ++this._mouseOutCount;
        if (this._mouseOutCount > 1)
          this.hidePopup();
        return;
      }

      // find out if the node we are entering is one of our anonymous children
      while (rel) {
        if (rel == this)
          break;
        rel = rel.parentNode;
      }

      // if the entered node is not a descendant of ours, hide the tooltip
      if (rel != this && this._isMouseOver) {
        this.hidePopup();
      }
    });

    this.addEventListener("popupshowing", (event) => {
      if (this.page && !this.fillInPageTooltip(this.triggerNode)) {
        event.preventDefault();
      }
    });

    this.addEventListener("popuphiding", (event) => {
      this._isMouseOver = false;
      this._mouseOutCount = 0;
    });

  }

  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <label class="tooltip-label" inherits="text=label" flex="1"></label>
      </children>
    `));
    this._mouseOutCount = 0;

    this._isMouseOver = false;

  }

  set label(val) {
    this.setAttribute('label', val);
    return val;
  }

  get label() {
    return this.getAttribute('label');
  }

  set page(val) {
    if (val) this.setAttribute('page', 'true');
    else this.removeAttribute('page');
    return val;
  }

  get page() {
    return this.getAttribute('page') == 'true';
  }

  get textProvider() {
    if (!this._textProvider) {
      this._textProvider = Cc["@mozilla.org/embedcomp/default-tooltiptextprovider;1"]
        .getService(Ci.nsITooltipTextProvider);
    }
    return this._textProvider;
  }

  /**
   * Given the supplied element within a page, set the tooltip's text to the text
   * for that element. Returns true if text was assigned, and false if the no text
   * is set, which normally would be used to cancel tooltip display.
   */
  fillInPageTooltip(tipElement) {
    let tttp = this.textProvider;
    let textObj = {},
      dirObj = {};
    let shouldChangeText = tttp.getNodeText(tipElement, textObj, dirObj);
    if (shouldChangeText) {
      this.style.direction = dirObj.value;
      this.label = textObj.value;
    }
    return shouldChangeText;
  }
}

customElements.define("tooltip", MozTooltip);

}
