class XblPreference extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-preference ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-preference", XblPreference);
