class XblNumberbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="textbox-input-box numberbox-input-box" flex="1" xbl:inherits="context,disabled,focused">
<input class="numberbox-input textbox-input" anonid="input" xbl:inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey">
</input>
</hbox>
<spinbuttons anonid="buttons" xbl:inherits="disabled,hidden=hidespinbuttons">
</spinbuttons>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-numberbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-numberbox", XblNumberbox);
