class XblCheckbox extends XblCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox", XblCheckbox);
