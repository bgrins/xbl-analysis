class FirefoxMenuMenubarIconic extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="menubar-left" inherits="src=image">
</image>
<firefox-text-label class="menubar-text" inherits="value=label,accesskey,crop" crop="right">
</firefox-text-label>
<children includes="menupopup">
</children>`;
    let comment = document.createComment(
      "Creating firefox-menu-menubar-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menu-menubar-iconic", FirefoxMenuMenubarIconic);
