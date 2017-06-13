class XblMenubar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menubar");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set statusbar(val) {
    this.setAttribute("statusbar", val);
    return val;
  }

  get statusbar() {
    return this.getAttribute("statusbar");
  }
  _updateStatusText(itemText) {
    if (!this._active) return;
    var newText = itemText ? itemText : this._originalStatusText;
    if (newText != this._statusbar.label) this._statusbar.label = newText;
  }
}
customElements.define("xbl-menubar", XblMenubar);
