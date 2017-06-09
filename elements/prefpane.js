class XblPrefpane extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox class="content-box" xbl:inherits="flex">
<children>
</children>
</vbox>`;
    let comment = document.createComment("Creating xbl-prefpane");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-prefpane", XblPrefpane);
