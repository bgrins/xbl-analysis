class XblTreecol extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<label class="treecol-text" xbl:inherits="crop,value=label" flex="1" crop="right">
</label>
<image class="treecol-sortdirection" xbl:inherits="sortDirection,hidden=hideheader">
</image>`;
    let comment = document.createComment("Creating xbl-treecol");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol", XblTreecol);
