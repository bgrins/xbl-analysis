class FirefoxRichlistitem extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>`;
    let comment = document.createComment("Creating firefox-richlistitem");
    this.prepend(comment);

    Object.defineProperty(this, "selectedByMouseOver", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.selectedByMouseOver;
        return (this.selectedByMouseOver = false);
      },
      set(val) {
        delete this.selectedByMouseOver;
        return (this.selectedByMouseOver = val);
      }
    });
  }
  disconnectedCallback() {
    try {
      var control = this.control;
      if (!control) return;
      // When we are destructed and we are current or selected, unselect ourselves
      // so that richlistbox's selection doesn't point to something not in the DOM.
      // We don't want to reset last-selected, so we set _suppressOnSelect.
      if (this.selected) {
        var suppressSelect = control._suppressOnSelect;
        control._suppressOnSelect = true;
        control.removeItemFromSelection(this);
        control._suppressOnSelect = suppressSelect;
      }
      if (this.current) control.currentItem = null;
    } catch (e) {}
  }

  get label() {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    return Array.map(
      this.getElementsByTagNameNS(XULNS, "label"),
      label => label.value
    ).join(" ");
  }

  set searchLabel(val) {
    if (val !== null) this.setAttribute("searchlabel", val);
    else
      // fall back to the label property (default value)
      this.removeAttribute("searchlabel");
    return val;
  }

  get searchLabel() {
    return this.hasAttribute("searchlabel")
      ? this.getAttribute("searchlabel")
      : this.label;
  }
}
customElements.define("firefox-richlistitem", FirefoxRichlistitem);
