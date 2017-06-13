class XblCaption extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="caption-icon" inherits="src=image">
</image>
<xbl-text-label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey">
</xbl-text-label>
</children>`;
    let comment = document.createComment("Creating xbl-caption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-caption", XblCaption);
