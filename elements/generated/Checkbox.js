class FirefoxCheckbox extends FirefoxCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-checkbox", FirefoxCheckbox);
