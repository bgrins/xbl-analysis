class FirefoxListitem extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<listcell inherits="label,crop,disabled,flexlabel">
</listcell>
</children>`;
    let comment = document.createComment("Creating firefox-listitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set current(val) {
    if (val) this.setAttribute("current", "true");
    else this.removeAttribute("current");

    let control = this.control;
    if (!control || !control.suppressMenuItemEvent) {
      this._fireEvent(val ? "DOMMenuItemActive" : "DOMMenuItemInactive");
    }

    return val;
  }

  get current() {
    return this.getAttribute("current") == "true";
  }

  set value(val) {
    this.setAttribute("value", val);
    return val;
  }

  get value() {
    return this.getAttribute("value");
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set selected(val) {
    if (val) this.setAttribute("selected", "true");
    else this.removeAttribute("selected");

    return val;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  get control() {
    var parent = this.parentNode;
    while (parent) {
      if (parent instanceof Components.interfaces.nsIDOMXULSelectControlElement)
        return parent;
      parent = parent.parentNode;
    }
    return null;
  }
  _fireEvent(name) {
    var event = document.createEvent("Events");
    event.initEvent(name, true, true);
    this.dispatchEvent(event);
  }
}
customElements.define("firefox-listitem", FirefoxListitem);
