class FirefoxSearchbarTreebody extends FirefoxAutocompleteTreebody {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("mousemove", event => {
      // Cancel the event so that the base binding doesn't select the row.
      event.preventDefault();
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-searchbar-treebody", FirefoxSearchbarTreebody);
