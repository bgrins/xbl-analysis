class XblListitem extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<listcell xbl:inherits="label,crop,disabled,flexlabel">
</listcell>
</children>`;
    let comment = document.createComment("Creating xbl-listitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem", XblListitem);
