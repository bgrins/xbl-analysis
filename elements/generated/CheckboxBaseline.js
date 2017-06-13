class XblCheckboxBaseline extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<input type='checkbox' />
<image class="checkbox-check" inherits="checked,disabled">
</image>
<hbox class="checkbox-label-box" flex="1">
<image class="checkbox-icon" inherits="src">
</image>
<xbl-text-label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1">
</xbl-text-label>
</hbox>`;
    let comment = document.createComment("Creating xbl-checkbox-baseline");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set checked(val) {
    return this.setChecked(val);
  }

  get checked() {
    return this.getAttribute("checked") == "true";
  }
  setChecked(aValue) {
    var change = aValue != (this.getAttribute("checked") == "true");
    if (aValue) this.setAttribute("checked", "true");
    else this.removeAttribute("checked");
    if (change) {
      var event = document.createEvent("Events");
      event.initEvent("CheckboxStateChange", true, true);
      this.dispatchEvent(event);
    }
    return aValue;
  }
}
customElements.define("xbl-checkbox-baseline", XblCheckboxBaseline);
