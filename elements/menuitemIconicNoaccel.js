class XblMenuitemIconicNoaccel extends XblMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuitem-iconic-noaccel";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-iconic-noaccel", XblMenuitemIconicNoaccel);
