class FirefoxTextarea extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="textbox-input-box" flex="1" inherits="context,spellcheck">
<html:textarea class="textbox-textarea" anonid="input" inherits="text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
<children>
</children>
</html:textarea>
</xul:hbox>`;
    let comment = document.createComment("Creating firefox-textarea");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-textarea", FirefoxTextarea);
