class XblStatusbarpanelIconicText extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="statusbarpanel-icon" xbl:inherits="src,src=image">
</image>
<label class="statusbarpanel-text" xbl:inherits="value=label,crop">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-statusbarpanel-iconic-text ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-iconic-text",
  XblStatusbarpanelIconicText
);
