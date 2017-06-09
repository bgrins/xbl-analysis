class XblMenulistEditable extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menulist-editable";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-editable", XblMenulistEditable);
