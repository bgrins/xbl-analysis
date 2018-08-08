class Textarea extends Textbox {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <moz-input-box anonid="moz-input-box" flex="1" inherits="context,spellcheck">
        <html:textarea class="textbox-textarea" anonid="input" inherits="text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
          <children></children>
        </html:textarea>
      </moz-input-box>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}