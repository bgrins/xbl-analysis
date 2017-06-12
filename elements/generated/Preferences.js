class XblPreferences extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-preferences");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-preferences", XblPreferences);
