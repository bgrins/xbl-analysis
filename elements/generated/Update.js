/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozUpdate extends MozRichlistitem {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox>
        <label class="update-name" inherits="value=name" flex="1" crop="right"></label>
        <label inherits="href=detailsURL,hidden=hideDetailsURL" class="text-link" value="FROM-DTD.update.details.label;"></label>
      </hbox>
      <hbox>
        <label class="update-installedOn-label"></label>
        <label class="update-installedOn-value" flex="1"></label>
      </hbox>
      <hbox>
        <label class="update-status-label"></label>
        <description class="update-status-value" flex="1"></description>
      </hbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }

  set name(val) {
    this.setAttribute('name', val);
    return val;
  }

  get name() {
    return this.getAttribute('name');
  }

  set detailsURL(val) {
    this.setAttribute('detailsURL', val);
    return val;
  }

  get detailsURL() {
    return this.getAttribute('detailsURL');
  }

  set installDate(val) {
    this.setAttribute("installDate", val);
    var field = document.getAnonymousElementByAttribute(this, "class", "update-installedOn-value");
    field.textContent = val;
    return val;
  }

  get installDate() {
    return this.getAttribute('installDate');
  }

  set hideDetailsURL(val) {
    this.setAttribute('hideDetailsURL', val);
    return val;
  }

  get hideDetailsURL() {
    return this.getAttribute('hideDetailsURL');
  }

  set status(val) {
    this.setAttribute("status", val);
    var field = document.getAnonymousElementByAttribute(this, "class", "update-status-value");
    field.textContent = val;
    return val;
  }

  get status() {
    return this.getAttribute('status');
  }
}

customElements.define("update", MozUpdate);

}
