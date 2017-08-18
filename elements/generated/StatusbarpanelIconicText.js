class FirefoxStatusbarpanelIconicText extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="statusbarpanel-icon" inherits="src,src=image">
</image>
<firefox-text-label class="statusbarpanel-text" inherits="value=label,crop">
</firefox-text-label>`;
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
