class XblTextBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-text-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-base", XblTextBase);
