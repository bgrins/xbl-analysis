class FirefoxCheckbox extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="checkbox-check" inherits="checked,disabled"></xul:image>
      <xul:hbox class="checkbox-label-box" flex="1">
        <xul:image class="checkbox-icon" inherits="src"></xul:image>
        <xul:label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1"></xul:label>
      </xul:hbox>
    `;

    this._setupEventListeners();
  }
  /**
   * public implementation
   */
  set checked(val) {
    return this.setChecked(val);
  }

  get checked() {
    return this.getAttribute('checked') == 'true';
  }
  setChecked(aValue) {
    var change = (aValue != (this.getAttribute("checked") == "true"));
    if (aValue)
      this.setAttribute("checked", "true");
    else
      this.removeAttribute("checked");
    if (change) {
      var event = document.createEvent("Events");
      event.initEvent("CheckboxStateChange", true, true);
      this.dispatchEvent(event);
    }
    return aValue;
  }

  _setupEventListeners() {
    /**
     * While it would seem we could do this by handling oncommand, we need can't
     * because any external oncommand handlers might get called before ours, and
     * then they would see the incorrect value of checked.
     */
    this.addEventListener("click", (event) => { if (!this.disabled) this.checked = !this.checked; });

    this.addEventListener("keypress", (event) => {
      this.checked = !this.checked;
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });

  }
}