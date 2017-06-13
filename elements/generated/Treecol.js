class XblTreecol extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xbl-text-label class="treecol-text" inherits="crop,value=label" flex="1" crop="right">
</xbl-text-label>
<image class="treecol-sortdirection" inherits="sortDirection,hidden=hideheader">
</image>`;
    let comment = document.createComment("Creating xbl-treecol");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol", XblTreecol);
