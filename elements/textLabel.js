class XblTextLabel extends XblTextBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-text-label ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-label", XblTextLabel);
