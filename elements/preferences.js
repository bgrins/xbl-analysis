class XblPreferences extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-preferences ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-preferences", XblPreferences);
