class XblListitemIconic extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listitem-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem-iconic", XblListitemIconic);
