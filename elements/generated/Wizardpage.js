class FirefoxWizardpage extends FirefoxWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-wizardpage");
    this.prepend(comment);

    Object.defineProperty(this, "pageIndex", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.pageIndex;
        return (this.pageIndex = -1);
      },
      set(val) {
        delete this.pageIndex;
        return (this.pageIndex = val);
      }
    });
  }
  disconnectedCallback() {}

  set pageid(val) {
    this.setAttribute("pageid", val);
  }

  get pageid() {
    return this.getAttribute("pageid");
  }

  set next(val) {
    this.setAttribute("next", val);
    this.parentNode._accessMethod = "random";
    return val;
  }

  get next() {
    return this.getAttribute("next");
  }
}
customElements.define("firefox-wizardpage", FirefoxWizardpage);
