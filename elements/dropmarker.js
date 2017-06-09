class XblDropmarker extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="dropmarker-icon">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-dropmarker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dropmarker", XblDropmarker);
