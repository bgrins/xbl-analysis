class XblDeck extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-deck");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set selectedIndex(val) {
    if (this.selectedIndex == val) return val;
    this.setAttribute("selectedIndex", val);
    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);
    return val;
  }

  get selectedIndex() {
    return this.getAttribute("selectedIndex") || "0";
  }

  set selectedPanel(val) {
    var selectedIndex = -1;
    for (var panel = val; panel != null; panel = panel.previousSibling)
      ++selectedIndex;
    this.selectedIndex = selectedIndex;
    return val;
  }

  get selectedPanel() {
    return this.childNodes[this.selectedIndex];
  }
}
customElements.define("xbl-deck", XblDeck);
