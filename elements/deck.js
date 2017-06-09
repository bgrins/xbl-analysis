class XblDeck extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-deck ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-deck", XblDeck);
