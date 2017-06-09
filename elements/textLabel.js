class XblTextLabel extends XblTextBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-text-label";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-label", XblTextLabel);
