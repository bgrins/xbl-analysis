class XblMenuitemIconicDescNoaccel extends XblMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuitem-iconic-desc-noaccel";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-menuitem-iconic-desc-noaccel",
  XblMenuitemIconicDescNoaccel
);
