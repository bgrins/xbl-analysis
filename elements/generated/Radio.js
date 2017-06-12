class XblRadio extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="radio-check" xbl:inherits="disabled,selected">
</image>
<hbox class="radio-label-box" align="center" flex="1">
<image class="radio-icon" xbl:inherits="src">
</image>
<label class="radio-label" xbl:inherits="xbl:text=label,accesskey,crop" flex="1">
</label>
</hbox>`;
    let comment = document.createComment("Creating xbl-radio");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get radioGroup() {
    return this.control;
  }
}
customElements.define("xbl-radio", XblRadio);
