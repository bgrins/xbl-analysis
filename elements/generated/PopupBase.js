class XblPopupBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-popup-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-base", XblPopupBase);
