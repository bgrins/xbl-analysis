class XblColorpickertile extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-colorpickertile");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpickertile", XblColorpickertile);
