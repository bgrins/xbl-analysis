class XblDropmarker extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="dropmarker-icon">
</image>`;
    let comment = document.createComment("Creating xbl-dropmarker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dropmarker", XblDropmarker);
