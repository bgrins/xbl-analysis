class XblPopupBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-popup-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-base", XblPopupBase);
