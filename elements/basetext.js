class XblBasetext extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-basetext ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-basetext", XblBasetext);
