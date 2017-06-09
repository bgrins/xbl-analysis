class XblColorpickerButton extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="colorpicker-button-colorbox" anonid="colorbox" flex="1" xbl:inherits="disabled">
</image>
<panel class="colorpicker-button-menupopup" anonid="colorpopup" noautofocus="true" level="top" onmousedown="event.stopPropagation()" onpopupshowing="this._colorPicker.onPopupShowing()" onpopuphiding="this._colorPicker.onPopupHiding()" onselect="this._colorPicker.pickerChange()">
<colorpicker xbl:inherits="palettename,disabled" allowevents="true" anonid="colorpicker">
</colorpicker>
</panel>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-colorpicker-button ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpicker-button", XblColorpickerButton);
