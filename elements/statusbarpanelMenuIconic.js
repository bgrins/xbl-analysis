class XblStatusbarpanelMenuIconic extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="statusbarpanel-icon" xbl:inherits="src,src=image">
</image>
<children>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-statusbarpanel-menu-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-menu-iconic",
  XblStatusbarpanelMenuIconic
);
