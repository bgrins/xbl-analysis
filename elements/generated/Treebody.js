class XblTreebody extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      undefined;
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-treebody");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treebody", XblTreebody);
