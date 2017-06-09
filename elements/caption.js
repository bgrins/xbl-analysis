class XblCaption extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-caption";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-caption", XblCaption);
