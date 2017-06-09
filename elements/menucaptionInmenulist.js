class XblMenucaptionInmenulist extends XblMenucaption {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menucaption-inmenulist";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption-inmenulist", XblMenucaptionInmenulist);
