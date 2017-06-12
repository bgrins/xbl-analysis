class XblMenucaption extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<label class="menu-text" xbl:inherits="value=label,crop" crop="right">
</label>`;
    let comment = document.createComment("Creating xbl-menucaption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption", XblMenucaption);
