class XblAutocompleteTreebody extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-treebody ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-treebody", XblAutocompleteTreebody);
