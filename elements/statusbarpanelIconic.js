class XblStatusbarpanelIconic extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="statusbarpanel-icon" xbl:inherits="src,src=image">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-statusbarpanel-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbarpanel-iconic", XblStatusbarpanelIconic);
