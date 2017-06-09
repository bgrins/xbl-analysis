class XblEditor extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-editor ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-editor", XblEditor);
