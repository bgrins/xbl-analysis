class XblNocontrols extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox flex="1" class="statusOverlay" hidden="true">
<box flex="1">
<box class="clickToPlay" flex="1">
</box>
</box>
</vbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-nocontrols ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-nocontrols", XblNocontrols);
