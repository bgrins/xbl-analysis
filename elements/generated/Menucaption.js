class XblMenucaption extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xbl-text-label class="menu-text" inherits="value=label,crop" crop="right">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-menucaption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption", XblMenucaption);
