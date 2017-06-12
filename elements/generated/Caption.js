class XblCaption extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="caption-icon" xbl:inherits="src=image">
</image>
<label class="caption-text" flex="1" xbl:inherits="default,value=label,crop,accesskey">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-caption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-caption", XblCaption);
