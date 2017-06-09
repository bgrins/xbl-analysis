class XblPopup extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
<children>
</children>
</arrowscrollbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-popup ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup", XblPopup);
