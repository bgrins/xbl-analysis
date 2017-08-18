class FirefoxTreecol extends FirefoxTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<firefox-text-label class="treecol-text" inherits="crop,value=label" flex="1" crop="right">
</firefox-text-label>
<image class="treecol-sortdirection" inherits="sortDirection,hidden=hideheader">
</image>`;
    let comment = document.createComment("Creating firefox-treecol");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treecol", FirefoxTreecol);
