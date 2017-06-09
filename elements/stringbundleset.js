class XblStringbundleset extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-stringbundleset ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundleset", XblStringbundleset);
