class FirefoxMenuitemIconicTooltip extends FirefoxMenuitemIconic {
  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("tooltiptext", this.getAttribute("acceltext"));
    // TODO: Simplify this to this.setAttribute("acceltext", "") once bug
    // 592424 is fixed
    document
      .getAnonymousElementByAttribute(this, "anonid", "accel")
      .firstChild.setAttribute("value", "");
  }
}
customElements.define(
  "firefox-menuitem-iconic-tooltip",
  FirefoxMenuitemIconicTooltip
);
