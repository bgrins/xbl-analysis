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
    let name = document.createElement("span");
    name.textContent = "Creating xbl-treecol ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol", XblTreecol);
