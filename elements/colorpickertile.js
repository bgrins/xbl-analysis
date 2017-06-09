class XblColorpickertile extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-colorpickertile";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpickertile", XblColorpickertile);
