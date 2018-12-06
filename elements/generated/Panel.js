/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozPanel extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("popupshowing", (event) => {
      // Capture the previous focus before has a chance to get set inside the panel
      try {
        this._prevFocus = Cu
          .getWeakReference(document.commandDispatcher.focusedElement);
        if (this._prevFocus.get())
          return;
      } catch (ex) {}

      this._prevFocus = Cu.getWeakReference(document.activeElement);
    });

    this.addEventListener("popupshown", (event) => {
      // Fire event for accessibility APIs
      var alertEvent = document.createEvent("Events");
      alertEvent.initEvent("AlertActive", true, true);
      this.dispatchEvent(alertEvent);
    });

    this.addEventListener("popuphiding", (event) => {
      try {
        this._currentFocus = document.commandDispatcher.focusedElement;
      } catch (e) {
        this._currentFocus = document.activeElement;
      }
    });

    this.addEventListener("popuphidden", (event) => {
      function doFocus() {
        // Focus was set on an element inside this panel,
        // so we need to move it back to where it was previously
        try {
          let fm = Cc["@mozilla.org/focus-manager;1"]
            .getService(Ci.nsIFocusManager);
          fm.setFocus(prevFocus, fm.FLAG_NOSCROLL);
        } catch (e) {
          prevFocus.focus();
        }
      }
      var currentFocus = this._currentFocus;
      var prevFocus = this._prevFocus ? this._prevFocus.get() : null;
      this._currentFocus = null;
      this._prevFocus = null;

      // Avoid changing focus if focus changed while we hide the popup
      // (This can happen e.g. if the popup is hiding as a result of a
      // click/keypress that focused something)
      let nowFocus;
      try {
        nowFocus = document.commandDispatcher.focusedElement;
      } catch (e) {
        nowFocus = document.activeElement;
      }
      if (nowFocus && nowFocus != currentFocus)
        return;

      if (prevFocus && this.getAttribute("norestorefocus") != "true") {
        // Try to restore focus
        try {
          if (document.commandDispatcher.focusedWindow != window)
            return; // Focus has already been set to a window outside of this panel
        } catch (ex) {}

        if (!currentFocus) {
          doFocus();
          return;
        }
        while (currentFocus) {
          if (currentFocus == this) {
            doFocus();
            return;
          }
          currentFocus = currentFocus.parentNode;
        }
      }
    });

  }

  connectedCallback() {

    if (this.delayConnectedCallback()) {
      return;
    }

    this._prevFocus = 0;

  }
}

customElements.define("panel", MozPanel);

}
