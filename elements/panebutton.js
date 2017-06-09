class XblPanebutton extends XblRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-panebutton";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panebutton", XblPanebutton);
