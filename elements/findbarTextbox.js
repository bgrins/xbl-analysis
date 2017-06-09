class XblFindbarTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-findbar-textbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-findbar-textbox", XblFindbarTextbox);
