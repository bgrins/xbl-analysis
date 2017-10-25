class FirefoxTreecol extends FirefoxTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:label class="treecol-text" inherits="crop,value=label" flex="1" crop="right">
</xul:label>
<xul:image class="treecol-sortdirection" inherits="sortDirection,hidden=hideheader">
</xul:image>`;
  }
}
customElements.define("firefox-treecol", FirefoxTreecol);
