class XblDialog extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-dialog";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dialog", XblDialog);
