class XblDeck extends BaseElement {
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
