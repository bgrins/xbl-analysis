class FirefoxCheckboxBaseline extends FirefoxBasetext {
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
<firefox-text-label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1">
</firefox-text-label>
</hbox>`;
    let comment = document.createComment("Creating firefox-checkbox-baseline");
    this.prepend(comment);

    this.addEventListener("click", event => {
      undefined;
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
