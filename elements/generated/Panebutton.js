class XblPanebutton extends XblRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="paneButtonIcon" inherits="src">
</image>
<xbl-text-label class="paneButtonLabel" inherits="value=label">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-panebutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panebutton", XblPanebutton);
