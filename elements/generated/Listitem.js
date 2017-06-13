class XblListitem extends XblBasetext {
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
    let comment = document.createComment("Creating xbl-listitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}

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

  get selected() {
    return this.getAttribute("selected") == "true";
  }
}
customElements.define("xbl-listitem", XblListitem);
