class XblInputBoxSpell extends XblInputBox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-input-box-spell";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-input-box-spell", XblInputBoxSpell);
