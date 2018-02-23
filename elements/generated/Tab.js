class FirefoxTab extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="tab-middle box-inherit" inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
        <xul:image class="tab-icon" inherits="validate,src=image" role="presentation"></xul:image>
        <xul:label class="tab-text" inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation"></xul:label>
      </xul:hbox>
    `;
    this.arrowKeysShouldWrap = /Mac/.test(navigator.platform);

    this._setupEventListeners();
  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get control() {
    var parent = this.parentNode;
    if (parent instanceof Components.interfaces.nsIDOMXULSelectControlElement)
      return parent;
    return null;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  set _selected(val) {
    if (val) {
      this.setAttribute("selected", "true");
      this.setAttribute("visuallyselected", "true");
    } else {
      this.removeAttribute("selected");
      this.removeAttribute("visuallyselected");
    }

    return val;
  }

  set linkedPanel(val) {
    this.setAttribute('linkedpanel', val);
    return val;
  }

  get linkedPanel() {
    return this.getAttribute('linkedpanel')
  }

  get TelemetryStopwatch() {
    let module = {};
    ChromeUtils.import("resource://gre/modules/TelemetryStopwatch.jsm", module);
    Object.defineProperty(this, "TelemetryStopwatch", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.TelemetryStopwatch
    });
    return module.TelemetryStopwatch;
  }

  _setupEventListeners() {
    this.addEventListener("mousedown", (event) => {
      if (this.disabled)
        return;

      if (this != this.parentNode.selectedItem) { // Not selected yet
        let stopwatchid = this.parentNode.getAttribute("stopwatchid");
        if (stopwatchid) {
          this.TelemetryStopwatch.start(stopwatchid);
        }

        // Call this before setting the 'ignorefocus' attribute because this
        // will pass on focus if the formerly selected tab was focused as well.
        this.parentNode._selectNewTab(this);

        var isTabFocused = false;
        try {
          isTabFocused = (document.commandDispatcher.focusedElement == this);
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

    this.addEventListener("keydown", (event) => {
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(direction == "ltr" ? -1 : 1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(direction == "ltr" ? 1 : -1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      this.parentNode.advanceSelectedTab(-1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      this.parentNode.advanceSelectedTab(1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      this.parentNode._selectNewTab(this.parentNode.childNodes[0]);
    });

    this.addEventListener("keydown", (event) => {
      var tabs = this.parentNode.childNodes;
      this.parentNode._selectNewTab(tabs[tabs.length - 1], -1);
    });

  }
}