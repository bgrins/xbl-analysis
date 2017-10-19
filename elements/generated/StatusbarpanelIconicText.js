class FirefoxStatusbarpanelIconicText extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="statusbarpanel-icon" inherits="src,src=image">
</xul:image>
<xul:label class="statusbarpanel-text" inherits="value=label,crop">
</xul:label>`;
    let comment = document.createComment(
      "Creating firefox-statusbarpanel-iconic-text"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-statusbarpanel-iconic-text",
  FirefoxStatusbarpanelIconicText
);
