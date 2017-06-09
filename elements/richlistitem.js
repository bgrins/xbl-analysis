class XblRichlistitem extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-richlistitem ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-richlistitem", XblRichlistitem);
