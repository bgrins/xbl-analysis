class XblMenulistPopuponly extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist-popuponly");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-popuponly", XblMenulistPopuponly);
