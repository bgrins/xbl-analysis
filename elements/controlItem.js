class XblControlItem extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-control-item ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-control-item", XblControlItem);
