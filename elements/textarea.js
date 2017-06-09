class XblTextarea extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck">
<textarea class="textbox-textarea" anonid="input" xbl:inherits="xbl:text=value,disabled,tabindex,rows,cols,readonly,wrap,placeholder,mozactionhint,spellcheck">
<children>
</children>
</textarea>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-textarea ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-textarea", XblTextarea);
