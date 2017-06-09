class XblControlItem extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-control-item";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-control-item", XblControlItem);
