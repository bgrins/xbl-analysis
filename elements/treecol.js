class XblTreecol extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

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
