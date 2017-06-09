class XblSuppresschangeevent extends XblScale {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-suppresschangeevent ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-suppresschangeevent", XblSuppresschangeevent);
