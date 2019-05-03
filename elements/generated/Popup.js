/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozPopup extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("popupshowing", (event) => {
      var array = [];
      var width = 0;
      for (var menuitem = this.firstElementChild; menuitem; menuitem = menuitem.nextElementSibling) {
        if (menuitem.localName == "menuitem" && menuitem.hasAttribute("acceltext")) {
          var accel = menuitem.menuAccel;
          if (accel) {
            array.push(accel);
            let accelWidth = accel.getBoundingClientRect().width;
            if (accelWidth > width) {
              width = accelWidth;
            }
          }
        }
      }
      for (var i = 0; i < array.length; i++)
        array[i].width = width;
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
        <children></children>
      </arrowscrollbox>
    `));

    this.scrollBox = document.getAnonymousElementByAttribute(this, "class", "popup-internal-box");

    this.AUTOSCROLL_INTERVAL = 25;

    this.NOT_DRAGGING = 0;

    this.DRAG_OVER_BUTTON = -1;

    this.DRAG_OVER_POPUP = 1;

    this._draggingState = this.NOT_DRAGGING;

    this._scrollTimer = 0;

    // Enable the drag-to-scroll events only in menulist popups.
    if (!this.parentNode || this.parentNode.localName != "menulist") {
      return;
    }

    // XBL bindings might be constructed more than once.
    if (this.eventListenersAdded) {
      return;
    }
    this.eventListenersAdded = true;

    this.addEventListener("popupshown", () => {
      // Enable drag scrolling even when the mouse wasn't used. The
      // mousemove handler will remove it if the mouse isn't down.
      this._enableDragScrolling(false);
    });

    this.addEventListener("popuphidden", () => {
      this._draggingState = this.NOT_DRAGGING;
      this._clearScrollTimer();
      this.releaseCapture();
    });

    this.addEventListener("mousedown", event => {
      if (event.button != 0) {
        return;
      }

      if (this.state == "open" &&
        (event.target.localName == "menuitem" ||
          event.target.localName == "menu" ||
          event.target.localName == "menucaption")) {
        this._enableDragScrolling(true);
      }
    });

    this.addEventListener("mouseup", event => {
      if (event.button != 0) {
        return;
      }

      this._draggingState = this.NOT_DRAGGING;
      this._clearScrollTimer();
    });

    this.addEventListener("mousemove", event => {
      if (!this._draggingState) {
        return;
      }

      this._clearScrollTimer();

      // If the user released the mouse before the popup opens, we will
      // still be capturing, so check that the button is still pressed. If
      // not, release the capture and do nothing else. This also handles if
      // the dropdown was opened via the keyboard.
      if (!(event.buttons & 1)) {
        this._draggingState = this.NOT_DRAGGING;
        this.releaseCapture();
        return;
      }

      // If dragging outside the top or bottom edge of the popup, but within
      // the popup area horizontally, scroll the list in that direction. The
      // _draggingState flag is used to ensure that scrolling does not start
      // until the mouse has moved over the popup first, preventing
      // scrolling while over the dropdown button.
      let popupRect = this.getOuterScreenRect();
      if (event.screenX >= popupRect.left &&
        event.screenX <= popupRect.right) {
        if (this._draggingState == this.DRAG_OVER_BUTTON) {
          if (event.screenY > popupRect.top &&
            event.screenY < popupRect.bottom) {
            this._draggingState = this.DRAG_OVER_POPUP;
          }
        }

        if (this._draggingState == this.DRAG_OVER_POPUP &&
          (event.screenY <= popupRect.top ||
            event.screenY >= popupRect.bottom)) {
          let scrollAmount = event.screenY <= popupRect.top ? -1 : 1;
          this.scrollBox.scrollByIndex(scrollAmount, true);

          let win = this.ownerGlobal;
          this._scrollTimer = win.setInterval(() => {
            this.scrollBox.scrollByIndex(scrollAmount, true);
          }, this.AUTOSCROLL_INTERVAL);
        }
      }
    });

  }

  _enableDragScrolling(overItem) {
    if (!this._draggingState) {
      this.setCaptureAlways();
      this._draggingState = overItem ? this.DRAG_OVER_POPUP : this.DRAG_OVER_BUTTON;
    }
  }

  _clearScrollTimer() {
    if (this._scrollTimer) {
      this.ownerGlobal.clearInterval(this._scrollTimer);
      this._scrollTimer = 0;
    }
  }
}

customElements.define("popup", MozPopup);

}
