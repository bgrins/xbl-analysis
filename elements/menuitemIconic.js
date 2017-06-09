class XblMenuitemIconic extends XblMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuitem-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-iconic", XblMenuitemIconic);
