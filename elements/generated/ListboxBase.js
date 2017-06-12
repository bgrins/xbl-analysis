class XblListboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-listbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listbox-base", XblListboxBase);
