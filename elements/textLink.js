class XblTextLink extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-text-link";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-link", XblTextLink);
