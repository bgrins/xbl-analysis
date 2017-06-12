class XblListitemCheckbox extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<listcell type="checkbox" xbl:inherits="label,crop,checked,disabled,flexlabel">
</listcell>
</children>`;
    let comment = document.createComment("Creating xbl-listitem-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get checked() {
    return this.getAttribute("checked") == "true";
  }
}
customElements.define("xbl-listitem-checkbox", XblListitemCheckbox);
