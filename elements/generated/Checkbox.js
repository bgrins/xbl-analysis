/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCheckbox extends MozBasetext {
  constructor() {
    super();

    /**
     * While it would seem we could do this by handling oncommand, we need can't
     * because any external oncommand handlers might get called before ours, and
     * then they would see the incorrect value of checked.
     */
    this.addEventListener("click", (event) => { if (event.button != 0) { return; } if (!this.disabled) this.checked = !this.checked; });

    this.addEventListener("keypress", (event) => {
      this.checked = !this.checked;
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="checkbox-check" inherits="checked,disabled"></image>
      <hbox class="checkbox-label-box" flex="1">
        <image class="checkbox-icon" inherits="src"></image>
        <label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1"></label>
      </hbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
  /**
   * public implementation
   */
  set checked(val) {
    return this.setChecked(val);
  }

  get checked() {
    return this.getAttribute('checked') == 'true';
  }

  setChecked(aValue) {
    var change = (aValue != (this.getAttribute("checked") == "true"));
    if (aValue)
      this.setAttribute("checked", "true");
    else
      this.removeAttribute("checked");
    if (change) {
      var event = document.createEvent("Events");
      event.initEvent("CheckboxStateChange", true, true);
      this.dispatchEvent(event);
    }
    return aValue;
  }
}

customElements.define("checkbox", MozCheckbox);

}
