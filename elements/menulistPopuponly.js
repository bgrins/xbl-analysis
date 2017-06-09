class XblMenulistPopuponly extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="menupopup">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menulist-popuponly ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-popuponly", XblMenulistPopuponly);
