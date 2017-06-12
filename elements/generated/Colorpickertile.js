class XblColorpickertile extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-colorpickertile");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpickertile", XblColorpickertile);
