class FirefoxListitem extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:listcell inherits="label,crop,disabled,flexlabel">
</xul:listcell>
</children>`;
    let comment = document.createComment("Creating firefox-listitem");
    this.prepend(comment);

    this.addEventListener("mousedown", event => {
      var control = this.control;
      if (!control || control.disabled) return;
      if (
        (!event.ctrlKey ||
          (/Mac/.test(navigator.platform) && event.button == 2)) &&
        !event.shiftKey &&
        !event.metaKey
      ) {
        if (!this.selected) {
          control.selectItem(this);
        }
        control.currentItem = this;
      }
    });

    this.addEventListener("click", event => {
      var control = this.control;
      if (!control || control.disabled) return;
      control._userSelecting = true;
      if (control.selType != "multiple") {
        control.selectItem(this);
      } else if (event.ctrlKey || event.metaKey) {
        control.toggleItemSelection(this);
        control.currentItem = this;
      } else if (event.shiftKey) {
        control.selectItemRange(null, this);
        control.currentItem = this;
      } else {
        /* We want to deselect all the selected items except what was
            clicked, UNLESS it was a right-click.  We have to do this
            in click rather than mousedown so that you can drag a
            selected group of items */

        // use selectItemRange instead of selectItem, because this
        // doesn't de- and reselect this item if it is selected
        control.selectItemRange(this, this);
      }
      control._userSelecting = false;
    });
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
