class FirefoxResizer extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    // don't do this for viewport resizers; causes a crash related to
    // bugs 563665 and 581536 otherwise
    if (this.parentNode == this.ownerDocument.documentElement) return;

    // if the direction is rtl, set the rtl attribute so that the
    // stylesheet can use this to make the cursor appear properly
    var cs = window.getComputedStyle(this);
    if (cs.writingMode === undefined || cs.writingMode == "horizontal-tb") {
      if (cs.direction == "rtl") {
        this.setAttribute("rtl", "true");
      }
    } else if (cs.writingMode.endsWith("-rl")) {
      // writing-modes 'vertical-rl' and 'sideways-rl' want rtl resizers,
      // as they will appear at the bottom left of the element
      this.setAttribute("rtl", "true");
    }
  }
  disconnectedCallback() {}
}
customElements.define("firefox-resizer", FirefoxResizer);
