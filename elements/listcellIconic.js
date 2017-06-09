class XblListcellIconic extends XblListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listcell-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell-iconic", XblListcellIconic);
