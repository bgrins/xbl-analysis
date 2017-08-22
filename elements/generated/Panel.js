class FirefoxPanel extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-panel");
    this.prepend(comment);

    Object.defineProperty(this, "_prevFocus", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._prevFocus;
        return (this._prevFocus = 0);
      },
      set(val) {
        delete this._prevFocus;
        return (this._prevFocus = val);
      }
    });
    Object.defineProperty(this, "_dragBindingAlive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = true);
      },
      set(val) {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = val);
      }
    });

    if (this.getAttribute("backdrag") == "true" && !this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        Components.utils.import(
          "resource://gre/modules/WindowDraggingUtils.jsm",
          tmp
        );
        let draghandle = new tmp.WindowDraggingElement(this);
        draghandle.mouseDownCheck = function() {
          return this._dragBindingAlive;
        };
      } catch (e) {}
    }

    this.addEventListener("popupshowing", event => {
      // Capture the previous focus before has a chance to get set inside the panel
      try {
        this._prevFocus = Components.utils.getWeakReference(
          document.commandDispatcher.focusedElement
        );
        if (this._prevFocus.get()) return;
      } catch (ex) {}

      this._prevFocus = Components.utils.getWeakReference(
        document.activeElement
      );
    });

    this.addEventListener("popupshown", event => {
      // Fire event for accessibility APIs
      var alertEvent = document.createEvent("Events");
      alertEvent.initEvent("AlertActive", true, true);
      this.dispatchEvent(alertEvent);
    });

    this.addEventListener("popuphiding", event => {
      try {
        this._currentFocus = document.commandDispatcher.focusedElement;
      } catch (e) {
        this._currentFocus = document.activeElement;
      }
    });

    this.addEventListener("popuphidden", event => {
      function doFocus() {
        // Focus was set on an element inside this panel,
        // so we need to move it back to where it was previously
        try {
          let fm = Components.classes[
            "@mozilla.org/focus-manager;1"
          ].getService(Components.interfaces.nsIFocusManager);
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
      if (nowFocus && nowFocus != currentFocus) return;

      if (prevFocus && this.getAttribute("norestorefocus") != "true") {
        // Try to restore focus
        try {
          if (document.commandDispatcher.focusedWindow != window) return; // Focus has already been set to a window outside of this panel
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
  disconnectedCallback() {}
}
customElements.define("firefox-panel", FirefoxPanel);
