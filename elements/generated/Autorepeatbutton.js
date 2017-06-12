class XblAutorepeatbutton extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="autorepeatbutton-icon">
</image>`;
    let comment = document.createComment("Creating xbl-autorepeatbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autorepeatbutton", XblAutorepeatbutton);
