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

    this.mLastMoveTime = Date.now();
    this.mousedOverIndex = -1;
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-autocomplete-richlistbox",
  FirefoxAutocompleteRichlistbox
);
