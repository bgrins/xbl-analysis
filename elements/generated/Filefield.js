class XblFilefield extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<stringbundle anonid="bundle" src="chrome://global/locale/filefield.properties">
</stringbundle>
<hbox class="fileFieldContentBox" align="center" flex="1" xbl:inherits="disabled">
<image class="fileFieldIcon" xbl:inherits="src=image,disabled">
</image>
<textbox class="fileFieldLabel" xbl:inherits="value=label,disabled,accesskey,tabindex,aria-labelledby" flex="1" readonly="true">
</textbox>
</hbox>`;
    let comment = document.createComment("Creating xbl-filefield");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get label() {
    return this.getAttribute("label");
  }

  get file() {
    return this._file;
  }
}
customElements.define("xbl-filefield", XblFilefield);
