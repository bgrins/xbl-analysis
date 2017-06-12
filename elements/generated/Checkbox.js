class XblCheckbox extends XblCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox", XblCheckbox);
