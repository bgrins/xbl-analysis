class FirefoxTextLabel extends FirefoxTextBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-text-label");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set accessKey(val) {
    this.setAttribute("accesskey", val);
    return val;
  }

  get accessKey() {
    var accessKey = this.getAttribute("accesskey");
    return accessKey ? accessKey[0] : null;
  }

  set control(val) {
    // After this gets set, the label will use the binding #label-control
    this.setAttribute("control", val);
    return val;
  }

  get control() {
    return getAttribute("control");
  }
}
customElements.define("firefox-text-label", FirefoxTextLabel);
