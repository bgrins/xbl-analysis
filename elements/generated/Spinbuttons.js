class XblSpinbuttons extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox class="spinbuttons-box" flex="1">
<button anonid="increaseButton" type="repeat" flex="1" class="spinbuttons-button spinbuttons-up" xbl:inherits="disabled,disabled=increasedisabled">
</button>
<button anonid="decreaseButton" type="repeat" flex="1" class="spinbuttons-button spinbuttons-down" xbl:inherits="disabled,disabled=decreasedisabled">
</button>
</vbox>`;
    let comment = document.createComment("Creating xbl-spinbuttons");
    this.prepend(comment);
  }
  disconnectedCallback() {}

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
customElements.define("xbl-spinbuttons", XblSpinbuttons);
