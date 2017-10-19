class FirefoxDatepickerPopup extends FirefoxDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="textbox-input-box datetimepicker-input-box" align="center" allowevents="true" inherits="context,disabled,readonly">
<xul:hbox class="datetimepicker-input-subbox" align="baseline">
<html:input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:label anonid="sep-first" class="datetimepicker-separator" value=":">
</xul:label>
<xul:hbox class="datetimepicker-input-subbox" align="baseline">
<html:input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:label anonid="sep-second" class="datetimepicker-separator" value=":">
</xul:label>
<xul:hbox class="datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:hbox class="datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
</xul:hbox>
<xul:spinbuttons anonid="buttons" inherits="disabled" allowevents="true" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</xul:spinbuttons>
<xul:dropmarker class="datepicker-dropmarker" inherits="disabled">
</xul:dropmarker>
<xul:panel onpopupshown="this.firstChild.focus();" level="top">
<xul:datepicker anonid="grid" type="grid" class="datepicker-popupgrid" inherits="disabled,readonly,firstdayofweek">
</xul:datepicker>
</xul:panel>`;
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
