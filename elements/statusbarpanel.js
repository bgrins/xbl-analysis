class XblStatusbarpanel extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<label class="statusbarpanel-text" xbl:inherits="value=label,crop" crop="right" flex="1">
</label>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-statusbarpanel ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbarpanel", XblStatusbarpanel);
