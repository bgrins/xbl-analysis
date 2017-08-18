class FirefoxStatusbarpanelMenuIconic extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="statusbarpanel-icon" inherits="src,src=image">
</image>
<children>
</children>`;
    let comment = document.createComment(
      "Creating firefox-statusbarpanel-menu-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-statusbarpanel-menu-iconic",
  FirefoxStatusbarpanelMenuIconic
);
