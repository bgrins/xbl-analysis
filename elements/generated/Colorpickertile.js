class FirefoxColorpickertile extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-colorpickertile");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-colorpickertile", FirefoxColorpickertile);
