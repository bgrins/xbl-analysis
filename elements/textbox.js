class XblTextbox extends HTMLElement {
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
    let name = document.createElement("span");
    name.textContent = "Creating xbl-textbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-textbox", XblTextbox);
