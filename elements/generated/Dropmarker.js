class XblDropmarker extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<image class="dropmarker-icon">
</image>`;
    let comment = document.createComment("Creating xbl-dropmarker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dropmarker", XblDropmarker);
