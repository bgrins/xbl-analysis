class FirefoxBasetext extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-basetext");
    this.prepend(comment);

    this.labelElement = "";
  }
  disconnectedCallback() {}

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set crop(val) {
    this.setAttribute("crop", val);
    return val;
  }

  get crop() {
    return this.getAttribute("crop");
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  set command(val) {
    this.setAttribute("command", val);
    return val;
  }

  get command() {
    return this.getAttribute("command");
  }

  set accessKey(val) {
    // Always store on the control
    this.setAttribute("accesskey", val);
    // If there is a label, change the accesskey on the labelElement
    // if it's also set there
    if (this.labelElement) {
      this.labelElement.accessKey = val;
    }
    return val;
  }

  get accessKey() {
    return this.labelElement
      ? this.labelElement.accessKey
      : this.getAttribute("accesskey");
  }
}
customElements.define("firefox-basetext", FirefoxBasetext);
