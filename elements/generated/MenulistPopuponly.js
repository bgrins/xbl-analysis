class XblMenulistPopuponly extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist-popuponly");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-popuponly", XblMenulistPopuponly);
