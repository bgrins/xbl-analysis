class XblDatetimepickerBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="datetimepicker-input-box" align="center" inherits="context,disabled,readonly">
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<xbl-text-label anonid="sep-first" class="datetimepicker-separator" value=":">
</xbl-text-label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<xbl-text-label anonid="sep-second" class="datetimepicker-separator" value=":">
</xbl-text-label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</spinbuttons>`;
    let comment = document.createComment("Creating xbl-datetimepicker-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get dateValue() {
    return new Date(this._dateValue);
  }

  set readOnly(val) {
    if (val) this.setAttribute("readonly", "true");
    else this.removeAttribute("readonly");
    return val;
  }

  get readOnly() {
    return this.getAttribute("readonly") == "true";
  }
}
customElements.define("xbl-datetimepicker-base", XblDatetimepickerBase);
