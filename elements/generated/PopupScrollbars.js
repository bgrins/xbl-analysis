/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozPopupScrollbars extends MozPopup {
  constructor() {
    super();

    this.addEventListener("popupshown", (event) => {
      // Enable drag scrolling even when the mouse wasn't used. The mousemove
      // handler will remove it if the mouse isn't down.
      this.enableDragScrolling(false);
    });

    this.addEventListener("popuphidden", (event) => {
      this._draggingState = this.NOT_DRAGGING;
      this._clearScrollTimer();
      this.releaseCapture();
    });

    this.addEventListener("mousedown", (event) => {
      if (event.button != 0) {
        return;
      }

      if (this.state == "open" &&
        (event.target.localName == "menuitem" ||
          event.target.localName == "menu" ||
          event.target.localName == "menucaption")) {
        this.enableDragScrolling(true);
      }
    });

    this.addEventListener("mouseup", (event) => {
      if (event.button != 0) {
        return;
      }

      this._draggingState = this.NOT_DRAGGING;
      this._clearScrollTimer();
    });

    this.addEventListener("mousemove", (event) => {
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
      // until the mouse has moved over the popup first, preventing scrolling
      // while over the dropdown button.
      let popupRect = this.getOuterScreenRect();
      if (event.screenX >= popupRect.left && event.screenX <= popupRect.right) {
        if (this._draggingState == this.DRAG_OVER_BUTTON) {
          if (event.screenY > popupRect.top && event.screenY < popupRect.bottom) {
            this._draggingState = this.DRAG_OVER_POPUP;
          }
        }

        if (this._draggingState == this.DRAG_OVER_POPUP &&
          (event.screenY <= popupRect.top || event.screenY >= popupRect.bottom)) {
          let scrollAmount = event.screenY <= popupRect.top ? -1 : 1;
          this.scrollBox.scrollByIndex(scrollAmount);

          let win = this.ownerGlobal;
          this._scrollTimer = win.setInterval(() => {
            this.scrollBox.scrollByIndex(scrollAmount);
          }, this.AUTOSCROLL_INTERVAL);
        }
      }
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <scrollbox class="popup-internal-box" flex="1" orient="vertical" style="overflow: auto;">
        <children></children>
      </scrollbox>
    `));

    this.AUTOSCROLL_INTERVAL = 25;

    this.NOT_DRAGGING = 0;

    this.DRAG_OVER_BUTTON = -1;

    this.DRAG_OVER_POPUP = 1;

    this._draggingState = this.NOT_DRAGGING;

    this._scrollTimer = 0;

  }

  enableDragScrolling(overItem) {
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

customElements.define("popup-scrollbars", MozPopupScrollbars);

}
