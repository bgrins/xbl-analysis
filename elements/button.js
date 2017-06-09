class XblButton extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-button";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button", XblButton);
