class XblListbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listbox", XblListbox);
