class XblPreferences extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-preferences");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-preferences", XblPreferences);
