/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCreatorLink extends MozXULElement {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label anonid="label" value="FROM-DTD.addon.createdBy.label;"></label>
      <label anonid="creator-link" class="creator-link text-link"></label>
      <label anonid="creator-name" class="creator-name"></label>
    `));

    this._label = document.getAnonymousElementByAttribute(this, "anonid", "label");

    this._creatorLink = document.getAnonymousElementByAttribute(this, "anonid", "creator-link");

    this._creatorName = document.getAnonymousElementByAttribute(this, "anonid", "creator-name");

    if (this.hasAttribute("nameonly") &&
      this.getAttribute("nameonly") == "true") {
      this._label.hidden = true;
    }

  }

  setCreator(aCreator, aHomepageURL) {
    if (!aCreator) {
      this.collapsed = true;
      return;
    }
    this.collapsed = false;
    var url = aCreator.url || aHomepageURL;
    var showLink = !!url;
    if (showLink) {
      this._creatorLink.value = aCreator.name;
      this._creatorLink.href = url;
    } else {
      this._creatorName.value = aCreator.name;
    }
    this._creatorLink.hidden = !showLink;
    this._creatorName.hidden = showLink;
  }
}

customElements.define("creator-link", MozCreatorLink);

}
