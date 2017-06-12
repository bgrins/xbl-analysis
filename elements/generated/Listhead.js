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
    let comment = document.createComment("Creating xbl-listhead");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listhead", XblListhead);