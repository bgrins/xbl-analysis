class XblScrollbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-scrollbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar-base", XblScrollbarBase);
