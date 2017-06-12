class XblTextLink extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-text-link");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set href(val) {
    this.setAttribute("href", val);
    return val;
  }

  get href() {
    return this.getAttribute("href");
  }
}
customElements.define("xbl-text-link", XblTextLink);
