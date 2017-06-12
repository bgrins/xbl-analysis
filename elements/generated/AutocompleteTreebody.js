class XblAutocompleteTreebody extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-autocomplete-treebody");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-treebody", XblAutocompleteTreebody);
