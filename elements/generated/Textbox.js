class XblTextbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck">
<input class="textbox-input" anonid="input" xbl:inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,noinitialfocus,mozactionhint,spellcheck">
</input>
</hbox>`;
    let comment = document.createComment("Creating xbl-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-textbox", XblTextbox);
