class XblListitemCheckboxIconic extends XblListitemCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<listcell type="checkbox" class="listcell-iconic" xbl:inherits="label,image,crop,checked,disabled,flexlabel">
</listcell>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listitem-checkbox-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-listitem-checkbox-iconic",
  XblListitemCheckboxIconic
);
