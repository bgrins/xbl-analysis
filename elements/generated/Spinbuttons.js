class FirefoxSpinbuttons extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:vbox class="spinbuttons-box" flex="1">
        <xul:button anonid="increaseButton" type="repeat" flex="1" class="spinbuttons-button spinbuttons-up" inherits="disabled,disabled=increasedisabled"></xul:button>
        <xul:button anonid="decreaseButton" type="repeat" flex="1" class="spinbuttons-button spinbuttons-down" inherits="disabled,disabled=decreasedisabled"></xul:button>
      </xul:vbox>
    `;

    this.addEventListener("mousedown", event => {
      // on the Mac, the native theme draws the spinbutton as a single widget
      // so a state attribute is set based on where the mouse button was pressed
      if (event.originalTarget == this._increaseButton)
        this.setAttribute("state", "up");
      else if (event.originalTarget == this._decreaseButton)
        this.setAttribute("state", "down");
    });

    this.addEventListener("mouseup", event => {
      this.removeAttribute("state");
    });

    this.addEventListener("mouseout", event => {
      this.removeAttribute("state");
    });

    this.addEventListener("command", event => {
      var eventname;
      if (event.originalTarget == this._increaseButton) eventname = "up";
      else if (event.originalTarget == this._decreaseButton) eventname = "down";

      var evt = document.createEvent("Events");
      evt.initEvent(eventname, true, true);
      var cancel = this.dispatchEvent(evt);

      if (this.hasAttribute("on" + eventname)) {
        var fn = new Function("event", this.getAttribute("on" + eventname));
        if (fn.call(this, event) == false) cancel = true;
      }

      return !cancel;
    });
  }

  get _increaseButton() {
    return document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "increaseButton"
    );
  }

  get _decreaseButton() {
    return document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "decreaseButton"
    );
  }

  set increaseDisabled(val) {
    if (val) this._increaseButton.setAttribute("disabled", "true");
    else this._increaseButton.removeAttribute("disabled");
    return val;
  }

  get increaseDisabled() {
    return this._increaseButton.getAttribute("disabled") == "true";
  }

  set decreaseDisabled(val) {
    if (val) this._decreaseButton.setAttribute("disabled", "true");
    else this._decreaseButton.removeAttribute("disabled");
    return val;
  }

  get decreaseDisabled() {
    return this._decreaseButton.getAttribute("disabled") == "true";
  }
}
customElements.define("firefox-spinbuttons", FirefoxSpinbuttons);
