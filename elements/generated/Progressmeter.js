class XblProgressmeter extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<spacer class="progress-bar" xbl:inherits="mode">
</spacer>
<spacer class="progress-remainder" xbl:inherits="mode">
</spacer>`;
    let comment = document.createComment("Creating xbl-progressmeter");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set mode(val) {
    if (this.mode != val) this.setAttribute("mode", val);
    return val;
  }

  get mode() {
    return this.getAttribute("mode");
  }

  get value() {
    return this.getAttribute("value") || "0";
  }

  set max(val) {
    this.setAttribute("max", isNaN(val) ? 100 : Math.max(val, 1));
    this.value = this.value;
    return val;
  }

  get max() {
    return this.getAttribute("max") || "100";
  }
}
customElements.define("xbl-progressmeter", XblProgressmeter);
