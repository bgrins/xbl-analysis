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
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listitem ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem", XblListitem);
