class XblMenucaption extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<label class="menu-text" xbl:inherits="value=label,crop" crop="right">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menucaption ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption", XblMenucaption);
