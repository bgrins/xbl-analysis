class XblPopupScrollbars extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<scrollbox class="popup-internal-box" flex="1" orient="vertical" style="overflow: auto;">
<children>
</children>
</scrollbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-popup-scrollbars ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-scrollbars", XblPopupScrollbars);
