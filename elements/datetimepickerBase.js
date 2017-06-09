class XblDatetimepickerBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="datetimepicker-input-box" align="center" xbl:inherits="context,disabled,readonly">
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<label anonid="sep-first" class="datetimepicker-separator" value=":">
</label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<label anonid="sep-second" class="datetimepicker-separator" value=":">
</label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
</hbox>
<spinbuttons anonid="buttons" xbl:inherits="disabled" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</spinbuttons>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-datetimepicker-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetimepicker-base", XblDatetimepickerBase);
