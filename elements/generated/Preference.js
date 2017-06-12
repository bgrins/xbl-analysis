class XblPreference extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-preference");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-preference", XblPreference);
