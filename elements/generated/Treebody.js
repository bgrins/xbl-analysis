class XblTreebody extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-treebody");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treebody", XblTreebody);
