class XblListitemIconic extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<listcell class="listcell-iconic" xbl:inherits="label,image,crop,disabled,flexlabel">
</listcell>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listitem-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem-iconic", XblListitemIconic);
