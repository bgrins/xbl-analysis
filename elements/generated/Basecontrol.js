class FirefoxBasecontrol extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-basecontrol");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set disabled(val) {
    if (val) this.setAttribute("disabled", "true");
    else this.removeAttribute("disabled");
    return val;
  }

  get disabled() {
    return this.getAttribute("disabled") == "true";
  }

  set tabIndex(val) {
    if (val) this.setAttribute("tabindex", val);
    else this.removeAttribute("tabindex");
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute("tabindex")) || 0;
  }
}
customElements.define("firefox-basecontrol", FirefoxBasecontrol);
