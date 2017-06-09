class XblMenulistDescription extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menulist-description";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-description", XblMenulistDescription);
