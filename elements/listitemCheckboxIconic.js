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
    let comment = document.createComment(
      "Creating xbl-listitem-checkbox-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-listitem-checkbox-iconic",
  XblListitemCheckboxIconic
);
