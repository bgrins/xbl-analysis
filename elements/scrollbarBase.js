class XblScrollbarBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-scrollbar-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar-base", XblScrollbarBase);
