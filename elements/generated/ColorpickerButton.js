class XblColorpickerButton extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="colorpicker-button-colorbox" anonid="colorbox" flex="1" xbl:inherits="disabled">
</image>
<panel class="colorpicker-button-menupopup" anonid="colorpopup" noautofocus="true" level="top" onmousedown="event.stopPropagation()" onpopupshowing="this._colorPicker.onPopupShowing()" onpopuphiding="this._colorPicker.onPopupHiding()" onselect="this._colorPicker.pickerChange()">
<colorpicker xbl:inherits="palettename,disabled" allowevents="true" anonid="colorpicker">
</colorpicker>
</panel>`;
    let comment = document.createComment("Creating xbl-colorpicker-button");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set open(val) {
    this.showPopup();
  }

  get open() {
    return this.getAttribute("open") == "true";
  }
}
customElements.define("xbl-colorpicker-button", XblColorpickerButton);
