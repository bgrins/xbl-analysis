class XblTreebody extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-treebody";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treebody", XblTreebody);
