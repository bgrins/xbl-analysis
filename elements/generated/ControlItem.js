class FirefoxControlItem extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-control-item");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set value(val) {
    this.setAttribute("value", val);
    return val;
  }

  get value() {
    return this.getAttribute("value");
  }
}
customElements.define("firefox-control-item", FirefoxControlItem);
