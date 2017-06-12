class XblTextarea extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck">
<textarea class="textbox-textarea" anonid="input" xbl:inherits="xbl:text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
<children>
</children>
</textarea>
</hbox>`;
    let comment = document.createComment("Creating xbl-textarea");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-textarea", XblTextarea);
