class XblStatusbarpanelIconicText extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="statusbarpanel-icon" inherits="src,src=image">
</image>
<xbl-text-label class="statusbarpanel-text" inherits="value=label,crop">
</xbl-text-label>`;
    let comment = document.createComment(
      "Creating xbl-statusbarpanel-iconic-text"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-iconic-text",
  XblStatusbarpanelIconicText
);
