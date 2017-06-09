class XblBrowser extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>`;
    let comment = document.createComment("Creating xbl-browser");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-browser", XblBrowser);
