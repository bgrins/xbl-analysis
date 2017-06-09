class XblSpinbuttons extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

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
}
customElements.define("xbl-spinbuttons", XblSpinbuttons);
