class FirefoxSearchbarTreebody extends FirefoxAutocompleteTreebody {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-searchbar-treebody");
    this.prepend(comment);

    this.addEventListener("mousemove", event => {
      // Cancel the event so that the base binding doesn't select the row.
      event.preventDefault();
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-searchbar-treebody", FirefoxSearchbarTreebody);
