class XblScalethumb extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-scalethumb ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scalethumb", XblScalethumb);
