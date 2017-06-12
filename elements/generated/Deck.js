class XblDeck extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-deck");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selectedIndex() {
    return this.getAttribute("selectedIndex") || "0";
  }
}
customElements.define("xbl-deck", XblDeck);
