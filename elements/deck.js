class XblDeck extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-deck");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-deck", XblDeck);
