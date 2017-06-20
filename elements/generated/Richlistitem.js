class XblRichlistitem extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>`;
    let comment = document.createComment("Creating xbl-richlistitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}

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
customElements.define("xbl-richlistitem", XblRichlistitem);
