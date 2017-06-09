class XblListhead extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<listheaditem>
<children includes="listheader">
</children>
</listheaditem>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listhead ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listhead", XblListhead);
