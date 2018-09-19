/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozCustomizableuiToolbarMenubarAutohide extends MozCustomizableuiToolbar {
  constructor() {
    super();

    this.addEventListener("DOMMenuBarActive", (event) => { this._setActive(); });

    this.addEventListener("popupshowing", (event) => { this._setActive(); });

    this.addEventListener("mousedown", (event) => { this._contextMenuListener.init(event); });

    this.addEventListener("DOMMenuBarInactive", (event) => {
      if (!this._contextMenuListener.active)
        this._setInactiveAsync();
    });

  }

  connectedCallback() {
    super.connectedCallback()

    this._inactiveTimeout = null;

    this._contextMenuListener = {
      toolbar: this,
      contextMenu: null,

      get active() {
        return !!this.contextMenu;
      },

      init(event) {
        let node = event.target;
        while (node != this.toolbar) {
          if (node.localName == "menupopup")
            return;
          node = node.parentNode;
        }

        let contextMenuId = this.toolbar.getAttribute("context");
        if (!contextMenuId)
          return;

        this.contextMenu = document.getElementById(contextMenuId);
        if (!this.contextMenu)
          return;

        this.contextMenu.addEventListener("popupshown", this);
        this.contextMenu.addEventListener("popuphiding", this);
        this.toolbar.addEventListener("mousemove", this);
      },
      handleEvent(event) {
        switch (event.type) {
          case "popupshown":
            this.toolbar.removeEventListener("mousemove", this);
            break;
          case "popuphiding":
          case "mousemove":
            this.toolbar._setInactiveAsync();
            this.toolbar.removeEventListener("mousemove", this);
            this.contextMenu.removeEventListener("popuphiding", this);
            this.contextMenu.removeEventListener("popupshown", this);
            this.contextMenu = null;
            break;
        }
      },
    };

    this._setInactive();

  }

  _setInactive() {
    this.setAttribute("inactive", "true");
  }

  _setInactiveAsync() {
    this._inactiveTimeout = setTimeout(function(self) {
      if (self.getAttribute("autohide") == "true") {
        self._inactiveTimeout = null;
        self._setInactive();
      }
    }, 0, this);
  }

  _setActive() {
    if (this._inactiveTimeout) {
      clearTimeout(this._inactiveTimeout);
      this._inactiveTimeout = null;
    }
    this.removeAttribute("inactive");
  }
  disconnectedCallback() {
    this._setActive();
  }
}

customElements.define("customizableui-toolbar-menubar-autohide", MozCustomizableuiToolbarMenubarAutohide);

}
