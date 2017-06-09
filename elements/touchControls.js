class XblTouchcontrols extends XblVideocontrols {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-touchcontrols";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-touchcontrols", XblTouchcontrols);
