class FirefoxTextarea extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="textbox-input-box" flex="1" inherits="context,spellcheck">
        <html:textarea class="textbox-textarea" anonid="input" inherits="text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
          <children></children>
        </html:textarea>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-textarea", FirefoxTextarea);
