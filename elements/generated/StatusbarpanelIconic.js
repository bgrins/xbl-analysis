class FirefoxStatusbarpanelIconic extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="statusbarpanel-icon" inherits="src,src=image">
</xul:image>`;
    let comment = document.createComment(
      "Creating firefox-statusbarpanel-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-statusbarpanel-iconic",
  FirefoxStatusbarpanelIconic
);
