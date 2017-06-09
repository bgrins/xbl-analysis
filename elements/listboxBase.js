class XblListboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-listbox-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listbox-base", XblListboxBase);
