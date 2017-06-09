class XblPrefwindow extends XblDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-prefwindow";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-prefwindow", XblPrefwindow);
