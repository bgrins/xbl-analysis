class FirefoxAutocompleteRichlistbox extends FirefoxRichlistbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-autocomplete-richlistbox"
    );
    this.prepend(comment);

    Object.defineProperty(this, "mLastMoveTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = Date.now());
      },
      set(val) {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = val);
      }
    });
    Object.defineProperty(this, "mousedOverIndex", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mousedOverIndex;
        return (this.mousedOverIndex = -1);
      },
      set(val) {
        delete this.mousedOverIndex;
        return (this.mousedOverIndex = val);
      }
    });
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-autocomplete-richlistbox",
  FirefoxAutocompleteRichlistbox
);
