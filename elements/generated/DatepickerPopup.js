class FirefoxDatepickerPopup extends FirefoxDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="textbox-input-box datetimepicker-input-box" align="center" allowevents="true" inherits="context,disabled,readonly">
<hbox class="datetimepicker-input-subbox" align="baseline">
<input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<firefox-text-label anonid="sep-first" class="datetimepicker-separator" value=":">
</firefox-text-label>
<hbox class="datetimepicker-input-subbox" align="baseline">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<firefox-text-label anonid="sep-second" class="datetimepicker-separator" value=":">
</firefox-text-label>
<hbox class="datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<hbox class="datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled" allowevents="true" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</spinbuttons>
<dropmarker class="datepicker-dropmarker" inherits="disabled">
</dropmarker>
<panel onpopupshown="this.firstChild.focus();" level="top">
<datepicker anonid="grid" type="grid" class="datepicker-popupgrid" inherits="disabled,readonly,firstdayofweek">
</datepicker>
</panel>`;
    let comment = document.createComment("Creating firefox-datepicker-popup");
    this.prepend(comment);

    undefined;
  }
  disconnectedCallback() {}

  set open(val) {
    if (this.boxObject instanceof MenuBoxObject) this.boxObject.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute("open");
  }

  set displayedMonth(val) {
    document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "grid"
    ).displayedMonth = val;
    return val;
  }

  get displayedMonth() {
    return document.getAnonymousElementByAttribute(this, "anonid", "grid")
      .displayedMonth;
  }

  set displayedYear(val) {
    document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "grid"
    ).displayedYear = val;
    return val;
  }

  get displayedYear() {
    return document.getAnonymousElementByAttribute(this, "anonid", "grid")
      .displayedYear;
  }
}
customElements.define("firefox-datepicker-popup", FirefoxDatepickerPopup);
