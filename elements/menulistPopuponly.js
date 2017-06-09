class XblMenulistPopuponly extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menulist-popuponly";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-popuponly", XblMenulistPopuponly);
