class FirefoxAutocompleteTreebody extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-autocomplete-treebody"
    );
    this.prepend(comment);

    Object.defineProperty(this, "mLastMoveTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = Date.now());
      }
    });
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-autocomplete-treebody",
  FirefoxAutocompleteTreebody
);
