class XblBasecontrol extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-basecontrol ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-basecontrol", XblBasecontrol);
