class XblAutorepeatbutton extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autorepeatbutton";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autorepeatbutton", XblAutorepeatbutton);
