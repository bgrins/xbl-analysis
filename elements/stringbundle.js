class XblStringbundle extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-stringbundle ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundle", XblStringbundle);
