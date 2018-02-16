class FirefoxColorpickerButton extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="colorpicker-button-colorbox" anonid="colorbox" flex="1" inherits="disabled"></xul:image>
      <xul:panel class="colorpicker-button-menupopup" anonid="colorpopup" noautofocus="true" level="top" onmousedown="event.stopPropagation()" onpopupshowing="this._colorPicker.onPopupShowing()" onpopuphiding="this._colorPicker.onPopupHiding()" onselect="this._colorPicker.pickerChange()">
        <xul:colorpicker inherits="palettename,disabled" allowevents="true" anonid="colorpicker"></xul:colorpicker>
      </xul:panel>
    `;

    this.initialize();

    this.setupHandlers();
  }

  set open(val) {
    this.showPopup();
  }

  get open() {
    return this.getAttribute('open') == 'true'
  }

  set color(val) {
    this.mColorBox.setAttribute("src",
      "data:image/svg+xml,<svg style='background-color: " +
      encodeURIComponent(val) +
      "' xmlns='http://www.w3.org/2000/svg' />");
    this.setAttribute("color", val);
    return val;
  }

  get color() {
    return this.getAttribute("color");
  }
  initialize() {
    this.mColorBox = document.getAnonymousElementByAttribute(this, "anonid", "colorbox");
    this.mColorBox.setAttribute("src",
      "data:image/svg+xml,<svg style='background-color: " +
      encodeURIComponent(this.color) +
      "' xmlns='http://www.w3.org/2000/svg' />");

    var popup = document.getAnonymousElementByAttribute(this, "anonid", "colorpopup");
    popup._colorPicker = this;

    this.mPicker = document.getAnonymousElementByAttribute(this, "anonid", "colorpicker");
  }
  _fireEvent(aTarget, aEventName) {
    try {
      var event = document.createEvent("Events");
      event.initEvent(aEventName, true, true);
      var cancel = !aTarget.dispatchEvent(event);
      if (aTarget.hasAttribute("on" + aEventName)) {
        var fn = new Function("event", aTarget.getAttribute("on" + aEventName));
        var rv = fn.call(aTarget, event);
        // eslint-disable-next-line mozilla/no-compare-against-boolean-literals
        if (rv == false)
          cancel = true;
      }
      return !cancel;
    } catch (e) {
      dump(e);
    }
    return false;
  }
  showPopup() {
    this.mPicker.parentNode.openPopup(this, "after_start", 0, 0, false, false);
  }
  hidePopup() {
    this.mPicker.parentNode.hidePopup();
  }
  onPopupShowing() {
    if ("resetHover" in this.mPicker)
      this.mPicker.resetHover();
    document.addEventListener("keydown", this.mPicker, true);
    this.mPicker.mIsPopup = true;
    // Initialize to current button's color
    this.mPicker.initColor(this.color);
  }
  onPopupHiding() {
    // Removes the key listener
    document.removeEventListener("keydown", this.mPicker, true);
    this.mPicker.mIsPopup = false;
  }
  pickerChange() {
    this.color = this.mPicker.color;
    setTimeout(function(aPopup) {
      aPopup.hidePopup();
    }, 1, this.mPicker.parentNode);

    this._fireEvent(this, "change");
  }

  setupHandlers() {

    this.addEventListener("keydown", (event) => {
      // open popup if key is space/up/left/right/down and popup is closed
      if ((event.keyCode == 32 || (event.keyCode > 36 && event.keyCode < 41)) && !this.open)
        this.showPopup();
      else if ((event.keyCode == 27) && this.open)
        this.hidePopup();
    });

  }
}