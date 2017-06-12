class XblDatepickerPopup extends XblDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="textbox-input-box datetimepicker-input-box" align="center" allowevents="true" xbl:inherits="context,disabled,readonly">
<hbox class="datetimepicker-input-subbox" align="baseline">
<input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<label anonid="sep-first" class="datetimepicker-separator" value=":">
</label>
<hbox class="datetimepicker-input-subbox" align="baseline">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<label anonid="sep-second" class="datetimepicker-separator" value=":">
</label>
<hbox class="datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
<hbox class="datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" xbl:inherits="disabled,readonly">
</input>
</hbox>
</hbox>
<spinbuttons anonid="buttons" xbl:inherits="disabled" allowevents="true" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</spinbuttons>
<dropmarker class="datepicker-dropmarker" xbl:inherits="disabled">
</dropmarker>
<panel onpopupshown="this.firstChild.focus();" level="top">
<datepicker anonid="grid" type="grid" class="datepicker-popupgrid" xbl:inherits="disabled,readonly,firstdayofweek">
</datepicker>
</panel>`;
    let comment = document.createComment("Creating xbl-datepicker-popup");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker-popup", XblDatepickerPopup);
