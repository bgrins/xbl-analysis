class XblAutorepeatbutton extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="autorepeatbutton-icon">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-autorepeatbutton ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autorepeatbutton", XblAutorepeatbutton);
