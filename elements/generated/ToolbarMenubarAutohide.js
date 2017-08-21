class FirefoxToolbarMenubarAutohide extends FirefoxToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-toolbar-menubar-autohide"
    );
    this.prepend(comment);

    Object.defineProperty(this, "_inactiveTimeout", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._inactiveTimeout;
        return (this._inactiveTimeout = null);
      },
      set(val) {
        delete this["_inactiveTimeout"];
        return (this["_inactiveTimeout"] = val);
      }
    });
    Object.defineProperty(this, "_contextMenuListener", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._contextMenuListener;
        return (this._contextMenuListener = {
          toolbar: this,
          contextMenu: null,

          get active() {
            return !!this.contextMenu;
          },

          init(event) {
            var node = event.target;
            while (node != this.toolbar) {
              if (node.localName == "menupopup") return;
              node = node.parentNode;
            }

            var contextMenuId = this.toolbar.getAttribute("context");
            if (!contextMenuId) return;

            this.contextMenu = document.getElementById(contextMenuId);
            if (!this.contextMenu) return;

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
          }
        });
      },
      set(val) {
        delete this["_contextMenuListener"];
        return (this["_contextMenuListener"] = val);
      }
    });

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {
    try {
      undefined;
    } catch (e) {}
  }
  _setInactive() {
    this.setAttribute("inactive", "true");
  }
  _setInactiveAsync() {
    this._inactiveTimeout = setTimeout(
      function(self) {
        if (self.getAttribute("autohide") == "true") {
          self._inactiveTimeout = null;
          self._setInactive();
        }
      },
      0,
      this
    );
  }
  _setActive() {
    if (this._inactiveTimeout) {
      clearTimeout(this._inactiveTimeout);
      this._inactiveTimeout = null;
    }
    this.removeAttribute("inactive");
  }
}
customElements.define(
  "firefox-toolbar-menubar-autohide",
  FirefoxToolbarMenubarAutohide
);
