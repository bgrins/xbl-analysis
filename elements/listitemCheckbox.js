class XblListitemCheckbox extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<listcell type="checkbox" xbl:inherits="label,crop,checked,disabled,flexlabel">
</listcell>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listitem-checkbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem-checkbox", XblListitemCheckbox);
