class XblColumnpicker extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-columnpicker";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-columnpicker", XblColumnpicker);
