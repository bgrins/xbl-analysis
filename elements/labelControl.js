class XblLabelControl extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-label-control";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-label-control", XblLabelControl);
