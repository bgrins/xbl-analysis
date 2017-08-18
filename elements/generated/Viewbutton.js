class XblViewbutton extends XblRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="viewButtonIcon" inherits="src">
</image>
<xbl-text-label class="viewButtonLabel" inherits="value=label">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-viewbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-viewbutton", XblViewbutton);
