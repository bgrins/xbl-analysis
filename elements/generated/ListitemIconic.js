class XblListitemIconic extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<listcell class="listcell-iconic" xbl:inherits="label,image,crop,disabled,flexlabel">
</listcell>
</children>`;
    let comment = document.createComment("Creating xbl-listitem-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem-iconic", XblListitemIconic);
