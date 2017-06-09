class XblTextLink extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-text-link ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-link", XblTextLink);
