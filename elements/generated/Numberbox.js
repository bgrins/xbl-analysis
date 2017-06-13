class XblNumberbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="textbox-input-box numberbox-input-box" flex="1" inherits="context,disabled,focused">
<input class="numberbox-input textbox-input" anonid="input" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey">
</input>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled,hidden=hidespinbuttons">
</spinbuttons>`;
    let comment = document.createComment("Creating xbl-numberbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set value(val) {
    return (this.valueNumber = val);
  }

  get value() {
    return "" + this.valueNumber;
  }
}
customElements.define("xbl-numberbox", XblNumberbox);
