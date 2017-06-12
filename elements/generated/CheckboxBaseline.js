class XblCheckboxBaseline extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<input type='checkbox' />
<image class="checkbox-check" xbl:inherits="checked,disabled">
</image>
<hbox class="checkbox-label-box" flex="1">
<image class="checkbox-icon" xbl:inherits="src">
</image>
<label class="checkbox-label" xbl:inherits="xbl:text=label,accesskey,crop" flex="1">
</label>
</hbox>`;
    let comment = document.createComment("Creating xbl-checkbox-baseline");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox-baseline", XblCheckboxBaseline);
