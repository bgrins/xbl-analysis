class XblPopupScrollbars extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<scrollbox class="popup-internal-box" flex="1" orient="vertical" style="overflow: auto;">
<children>
</children>
</scrollbox>`;
    let comment = document.createComment("Creating xbl-popup-scrollbars");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-scrollbars", XblPopupScrollbars);
