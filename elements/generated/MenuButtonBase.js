/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuButtonBase extends MozButtonBase {
  connectedCallback() {
    super.connectedCallback()

    this._pendingActive = false;

    this.init();

    this._setupEventListeners();
  }

  set buttonover(val) {
    var v = val || val == "true";
    if (!v && this.buttondown) {
      this.buttondown = false;
      this._pendingActive = true;
    } else if (this._pendingActive) {
      this.buttondown = true;
      this._pendingActive = false;
    }

    if (v)
      this.setAttribute("buttonover", "true");
    else
      this.removeAttribute("buttonover");
    return val;
  }

  get buttonover() {
    return this.getAttribute('buttonover');
  }

  set buttondown(val) {
    if (val || val == "true")
      this.setAttribute("buttondown", "true");
    else
      this.removeAttribute("buttondown");
    return val;
  }

  get buttondown() {
    return this.getAttribute('buttondown') == 'true';
  }

  init() {
    var btn = document.getAnonymousElementByAttribute(this, "anonid", "button");
    if (!btn)
      throw "XBL binding for <button type=\"menu-button\"/> binding must contain an element with anonid=\"button\"";

    var menubuttonParent = this;
    btn.addEventListener("mouseover", function() {
      if (!this.disabled)
        menubuttonParent.buttonover = true;
    }, true);
    btn.addEventListener("mouseout", function() {
      menubuttonParent.buttonover = false;
    }, true);
    btn.addEventListener("mousedown", function() {
      if (!this.disabled) {
        menubuttonParent.buttondown = true;
        document.addEventListener("mouseup", menubuttonParent, true);
      }
    }, true);
  }

  handleEvent(aEvent) {
    this._pendingActive = false;
    this.buttondown = false;
    document.removeEventListener("mouseup", this, true);
  }

  _setupEventListeners() {
    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RETURN) { return; }
      if (event.originalTarget == this)
        this.open = true;
    });

    this.addEventListener("keypress", (event) => {
      if (event.originalTarget == this) {
        this.open = true;
        // Prevent page from scrolling on the space key.
        event.preventDefault();
      }
    });

  }
}

customElements.define("menu-button-base", MozMenuButtonBase);

}
