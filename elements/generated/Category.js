/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCategory extends MozRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image anonid="icon" class="category-icon"></image>
      <label anonid="name" class="category-name" crop="end" flex="1" inherits="value=name"></label>
      <label anonid="badge" class="category-badge" inherits="value=count"></label>
    `));

    if (!this.hasAttribute("count"))
      this.setAttribute("count", 0);

    this._setupEventListeners();
  }

  set badgeCount(val) {
    if (this.getAttribute("count") == val)
      return;

    this.setAttribute("count", val);
    var event = document.createEvent("Events");
    event.initEvent("CategoryBadgeUpdated", true, true);
    this.dispatchEvent(event);
  }

  get badgeCount() {
    return this.getAttribute("count");
  }

  _setupEventListeners() {

  }
}

customElements.define("category", MozCategory);

}
