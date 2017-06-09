class XblMenucaption extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menucaption";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption", XblMenucaption);
