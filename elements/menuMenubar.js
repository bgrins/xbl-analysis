class XblMenuMenubar extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<label class="menubar-text" xbl:inherits="value=label,accesskey,crop" crop="right">
</label>
<children includes="menupopup">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-menubar ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-menubar", XblMenuMenubar);
