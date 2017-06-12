class XblButtonBase extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set type(val) {
    this.setAttribute("type", val);
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set dlgType(val) {
    this.setAttribute("dlgtype", val);
    return val;
  }

  get dlgType() {
    return this.getAttribute("dlgtype");
  }

  set group(val) {
    this.setAttribute("group", val);
    return val;
  }

  get group() {
    return this.getAttribute("group");
  }

  get open() {
    return this.hasAttribute("open");
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set autoCheck(val) {
    this.setAttribute("autoCheck", val);
    return val;
  }

  get autoCheck() {
    return this.getAttribute("autoCheck") == "true";
  }
}
customElements.define("xbl-button-base", XblButtonBase);
