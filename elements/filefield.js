class XblFilefield extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<stringbundle anonid="bundle" src="chrome://global/locale/filefield.properties">
</stringbundle>
<hbox class="fileFieldContentBox" align="center" flex="1" xbl:inherits="disabled">
<image class="fileFieldIcon" xbl:inherits="src=image,disabled">
</image>
<textbox class="fileFieldLabel" xbl:inherits="value=label,disabled,accesskey,tabindex,aria-labelledby" flex="1" readonly="true">
</textbox>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-filefield ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-filefield", XblFilefield);
