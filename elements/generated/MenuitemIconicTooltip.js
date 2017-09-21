class FirefoxMenuitemIconicTooltip extends FirefoxMenuitemIconic {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-menuitem-iconic-tooltip"
    );
    this.prepend(comment);

    this.setAttribute("tooltiptext", this.getAttribute("acceltext"));
    // TODO: Simplify this to this.setAttribute("acceltext", "") once bug
    // 592424 is fixed
    document
      .getAnonymousElementByAttribute(this, "anonid", "accel")
      .firstChild.setAttribute("value", "");
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-menuitem-iconic-tooltip",
  FirefoxMenuitemIconicTooltip
);
