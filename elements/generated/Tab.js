class XblTab extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="tab-middle box-inherit" inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
<image class="tab-icon" inherits="validate,src=image" role="presentation">
</image>
<xbl-text-label class="tab-text" inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation">
</xbl-text-label>
</hbox>`;
    let comment = document.createComment("Creating xbl-tab");
    this.prepend(comment);
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
customElements.define("xbl-tab", XblTab);
