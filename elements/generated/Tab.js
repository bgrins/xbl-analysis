class FirefoxTab extends FirefoxControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="tab-middle box-inherit" inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
<xul:image class="tab-icon" inherits="validate,src=image" role="presentation">
</xul:image>
<xul:label class="tab-text" inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation">
</xul:label>
</xul:hbox>`;
    let comment = document.createComment("Creating firefox-tab");
    this.prepend(comment);

    Object.defineProperty(this, "arrowKeysShouldWrap", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.arrowKeysShouldWrap;
        return (this.arrowKeysShouldWrap = /Mac/.test(navigator.platform));
      }
    });

    this.addEventListener("mousedown", event => {
      if (this.disabled) return;

      if (this != this.parentNode.selectedItem) {
        // Not selected yet
        let stopwatchid = this.parentNode.getAttribute("stopwatchid");
        if (stopwatchid) {
          this.TelemetryStopwatch.start(stopwatchid);
        }

        // Call this before setting the 'ignorefocus' attribute because this
        // will pass on focus if the formerly selected tab was focused as well.
        this.parentNode._selectNewTab(this);

        var isTabFocused = false;
        try {
          isTabFocused = document.commandDispatcher.focusedElement == this;
        } catch (e) {}

        // Set '-moz-user-focus' to 'ignore' so that PostHandleEvent() can't
        // focus the tab; we only want tabs to be focusable by the mouse if
        // they are already focused. After a short timeout we'll reset
        // '-moz-user-focus' so that tabs can be focused by keyboard again.
        if (!isTabFocused) {
          this.setAttribute("ignorefocus", "true");
          setTimeout(tab => tab.removeAttribute("ignorefocus"), 0, this);
        }

        if (stopwatchid) {
          this.TelemetryStopwatch.finish(stopwatchid);
        }
      }
      // Otherwise this tab is already selected and we will fall
      // through to mousedown behavior which sets focus on the current tab,
      // Only a click on an already selected tab should focus the tab itself.
    });

    this.addEventListener("keydown", event => {
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(
        direction == "ltr" ? -1 : 1,
        this.arrowKeysShouldWrap
      );
    });

    this.addEventListener("keydown", event => {
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(
        direction == "ltr" ? 1 : -1,
        this.arrowKeysShouldWrap
      );
    });

    this.addEventListener("keydown", event => {
      this.parentNode.advanceSelectedTab(-1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", event => {
      this.parentNode.advanceSelectedTab(1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", event => {
      this.parentNode._selectNewTab(this.parentNode.childNodes[0]);
    });

    this.addEventListener("keydown", event => {
      var tabs = this.parentNode.childNodes;
      this.parentNode._selectNewTab(tabs[tabs.length - 1], -1);
    });
  }
  disconnectedCallback() {}

  get control() {
    var parent = this.parentNode;
    if (parent instanceof Components.interfaces.nsIDOMXULSelectControlElement)
      return parent;
    return null;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  set _selected(val) {
    if (val) {
      this.setAttribute("selected", "true");
      this.setAttribute("visuallyselected", "true");
    } else {
      this.removeAttribute("selected");
      this.removeAttribute("visuallyselected");
    }

    this._setPositionAttributes(val);

    return val;
  }

  set linkedPanel(val) {
    this.setAttribute("linkedpanel", val);
    return val;
  }

  get linkedPanel() {
    return this.getAttribute("linkedpanel");
  }

  get TelemetryStopwatch() {
    let module = {};
    Cu.import("resource://gre/modules/TelemetryStopwatch.jsm", module);
    Object.defineProperty(this, "TelemetryStopwatch", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.TelemetryStopwatch
    });
    return module.TelemetryStopwatch;
  }
  _setPositionAttributes(aSelected) {
    if (this.previousSibling && this.previousSibling.localName == "tab") {
      if (aSelected)
        this.previousSibling.setAttribute("beforeselected", "true");
      else this.previousSibling.removeAttribute("beforeselected");
      this.removeAttribute("first-tab");
    } else {
      this.setAttribute("first-tab", "true");
    }

    if (this.nextSibling && this.nextSibling.localName == "tab") {
      if (aSelected) this.nextSibling.setAttribute("afterselected", "true");
      else this.nextSibling.removeAttribute("afterselected");
      this.removeAttribute("last-tab");
    } else {
      this.setAttribute("last-tab", "true");
    }
  }
}
customElements.define("firefox-tab", FirefoxTab);
