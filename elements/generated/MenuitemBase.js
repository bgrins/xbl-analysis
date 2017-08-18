class FirefoxMenuitemBase extends FirefoxControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menuitem-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  get control() {
    var parent = this.parentNode;
    if (
      parent &&
      parent.parentNode instanceof
        Components.interfaces.nsIDOMXULSelectControlElement
    )
      return parent.parentNode;
    return null;
  }

  get parentContainer() {
    undefined;
  }
}
customElements.define("firefox-menuitem-base", FirefoxMenuitemBase);
