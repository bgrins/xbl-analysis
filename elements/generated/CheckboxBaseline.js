class FirefoxCheckboxBaseline extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<input type='checkbox' />
<xul:image class="checkbox-check" inherits="checked,disabled">
</xul:image>
<xul:hbox class="checkbox-label-box" flex="1">
<xul:image class="checkbox-icon" inherits="src">
</xul:image>
<xul:label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1">
</xul:label>
</xul:hbox>`;

    this.addEventListener("click", event => {
      if (!this.disabled) this.checked = !this.checked;
    });

    this.addEventListener("keypress", event => {
      this.checked = !this.checked;
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });
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
customElements.define("firefox-checkbox-baseline", FirefoxCheckboxBaseline);
